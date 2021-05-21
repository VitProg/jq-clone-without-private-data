import { IAuthService, IProfileService } from './types'
import { inject, resolve } from '../../ioc/ioc.utils'
import { IApiService} from '../types'
import { action, makeAutoObservable, makeObservable, runInAction } from 'mobx'
import { User } from '../../../common/forum/models/user'
import { ILoginResponse, IRefreshTokenResponse } from '../../../common/responses/auth.responses'
import { store } from '../../store'
import { container } from '../../ioc/ioc.container'
import { ApiServiceSymbol, ProfileServiceSymbol } from '../ioc.symbols'
import { createUserModel } from '../../../common/forum/fabrics/create-user.fabric'
import { LoginRequest } from '../api.requests'


export class AuthService implements IAuthService {
  private readonly api = resolve<IApiService>(ApiServiceSymbol)

  constructor () {
    makeObservable(this)
  }

  @action
  async login (params: LoginRequest): Promise<undefined | User> {
    const base64 = btoa(params.username + ':' + params.password);

    const response = await this.api()
      .post<ILoginResponse>(
        'auth/login',
        {
          // json: params,
          withJWTHeaders: false,
          refreshTokenIsAccessError: false,
          addHeaders: {'Authorization': `Basic ${base64}`},
        }
      )

    if (response) {
      await this.saveSession(response.accessToken)
      await this.updateProfile()
    }

    return store.myStore.user
  }

  @action
  async refreshToken (updateProfile = false): Promise<boolean> {
    try {
      const response = await this.api()
        .post<IRefreshTokenResponse>(
          'auth/refresh-token',
          {
            withJWTHeaders: false,
            refreshTokenIsAccessError: false,
          }
        )

      if (response) {
        await this.saveSession(response.accessToken)
        if (updateProfile) {
          await this.updateProfile()
        }
        return true
      }
      return false
    } catch {
      return false
    }
  }

  @action
  async logout () {
    await this.api()
      .post<ILoginResponse>(
        'auth/logout',
        {
          withJWTHeaders: true,
          parseAsJson: false,
        }
      )

    this.clearSession()
  }

  @action
  async logoutAll () {
    await this.api()
      .post<ILoginResponse>(
        'auth/logoutAll',
        {
          withJWTHeaders: true,
          parseAsJson: false,
        }
      )

    this.clearSession()
  }


  @action
  private clearSession () {
    store.myStore.clearUser()
  }

  @action
  private async saveSession (accessToken: string | undefined) {
    if (!accessToken) {
      return this.clearSession()
    }
    store.myStore.setToken(accessToken)
  }

  @action
  private async updateProfile () {
    const profileService = container.get<IProfileService>(ProfileServiceSymbol)

    const user = createUserModel(await profileService.profile())
    runInAction(() => {
      if (user) {
        store.myStore.setUser(user, store.myStore.token)
      } else {
        store.myStore.clearUser()
      }
    })
  }

}
