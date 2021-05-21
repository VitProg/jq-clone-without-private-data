import KY from 'ky-universal'
import { IApiService } from './types'
import { store } from '../store'
import { Options } from 'ky'
import { container } from '../ioc/ioc.container'
import { ApiSendConfig, IAuthService } from './my/types'
import { AuthServiceSymbol } from './ioc.symbols'
import { isArray, isObject } from '../../common/type-guards'
import { abortedRequestPromise } from './utils'


const MAX_REFRESH_TOKEN_TRY_COUNT = 2

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/;

const shiftTime = 1000 * (parseInt(process.env.SHIFT_TIME as any, 10))

const jsonReviver = (key: string, value: any) => {
  if (typeof value === "string" && dateFormat.test(value)) {
    const t = (new Date(value)).getTime() + (shiftTime)
    return new Date(t)
  }

  return value;
}

export class ApiService implements IApiService {
  private readonly baseApiUrl = '/api'

  constructor () {
  }

  delete<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, "searchParams" | "method" | 'endpoint'>): Promise<T | undefined> {
    return this.send({
      endpoint,
      method: 'delete',
      ...config,
    })
  }

  get<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, "json" | "method" | 'endpoint'>): Promise<T | undefined> {
    return this.send({
      endpoint,
      method: 'get',
      ...config,
    })
  }

  patch<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, "searchParams" | "method" | 'endpoint'>): Promise<T | undefined> {
    return this.send({
      endpoint,
      method: 'patch',
      ...config,
    })
  }

  post<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, "searchParams" | "method" | 'endpoint'>): Promise<T | undefined> {
    return this.send({
      endpoint,
      method: 'post',
      ...config,
    })
  }

  put<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, "searchParams" | "method" | 'endpoint'>): Promise<T | undefined> {
    return this.send({
      endpoint,
      method: 'put',
      ...config,
    })
  }


  send<T> (config: ApiSendConfig<T>): Promise<T> {
    const {
      endpoint,
      method = 'get',
      body,
      json,
      parseAsJson = true,
      searchParams,
      addHeaders,
      withJWTHeaders = true,
      withCookies = true,
      refreshTokenIsAccessError = true,
      cancelable = false,
      reformat,
    } = config

    let options: Options = {
      method,
      prefixUrl: this.baseApiUrl,
      headers: withJWTHeaders ? this.authHeaders : {},
      credentials: withCookies ? 'same-origin' : 'omit',
    }

    if (refreshTokenIsAccessError) {
      options = {
        ...options,
        ...this.retryOptions,
      }
    }

    let abortController: AbortController
    if (cancelable) {
      abortController = new AbortController()
      options.signal = abortController.signal
    }

    if (addHeaders) {
      options.headers = {
        ...options.headers,
        ...(addHeaders as any)
      }
    }

    if (searchParams) {
      const search = new URLSearchParams()
      for (const [key, value] of Object.entries(searchParams)) {
        if (isArray(value)) {
          search.set(key, value.join(','))
        } else if (isObject(value)) {
          search.set(key, JSON.stringify(value))
        } else {
          search.set(key, value.toString())
        }
      }
      options.searchParams = search
    }

    if (body) {
      options.body = body
    }

    if (json) {
      options.json = json
    }

    let promise: Promise<any>

    if (parseAsJson) {
      promise = KY(endpoint, options)
        .text()
        .then(text => JSON.parse(text, jsonReviver) as T)

      if (reformat) {
        promise = promise.then(data => {
          reformat(data)
          return data
        })
      }
    } else {
      promise = KY(endpoint, options)
    }

    if (cancelable) {
      return abortedRequestPromise(
        promise,
        abortController!,
      ) as any
    }
    return promise
  }

  get retryOptions (): Options {
    return {
      retry: {
        limit: MAX_REFRESH_TOKEN_TRY_COUNT,
        methods: ['post', 'get', 'put', 'delete', 'patch'],
        statusCodes: [401, 500, 502, 503, 504],
      },
      hooks: {
        beforeRetry: [
          async ({ request, options, error, retryCount }) => {
            if ((error as any)?.response?.status === 401) {
              const authService = container.get<IAuthService>(AuthServiceSymbol)
              await authService.refreshToken()
              const auth = this.authHeaders
              if (auth) {
                for (const [k, v] of Object.entries(auth)) {
                  request.headers.set(k, v)
                }
              }
            }
          }
        ],
      }
    }
  }

  // noinspection JSMethodCanBeStatic
  private get authHeaders (): undefined | Record<string, string> {
    if (store.myStore.token) {
      return { 'Authorization': `Bearer ${store.myStore.token}` }
    }
  }
}
