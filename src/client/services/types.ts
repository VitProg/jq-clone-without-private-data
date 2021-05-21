import { ApiSendConfig } from './my/types'


export interface IApiService {
  send<T> (config: ApiSendConfig<T>): Promise<T | undefined>

  get<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'json' | 'method' | 'endpoint'>): Promise<T | undefined>

  post<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'searchParams' | 'method' | 'endpoint'>): Promise<T | undefined>

  put<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'searchParams' | 'method' | 'endpoint'>): Promise<T | undefined>

  patch<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'searchParams' | 'method' | 'endpoint'>): Promise<T | undefined>

  delete<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'searchParams' | 'method' | 'endpoint'>): Promise<T | undefined>
}

