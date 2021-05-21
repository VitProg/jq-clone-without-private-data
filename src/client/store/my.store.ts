import { IRootStore, IMyStore } from './types'
import { action, computed, makeObservable, observable } from 'mobx'
import { User } from '../../common/forum/models/user'
import { container } from '../ioc/ioc.container'
import { IAuthService } from '../services/my/types'
import { AuthServiceSymbol } from '../services/ioc.symbols'


const REFRESH_TOKEN_INTERVAL = 4.5 * 60 * 1000 // 4.5 minutes

export class MyStore implements IMyStore {
  user?: User = undefined
  token?: string = undefined
  private refreshTokenInterval: number | undefined

  constructor () {
    makeObservable(this, {
      // root: false
      user: observable,
      token: observable,
      setUser: action.bound,
      clearUser: action.bound,
      isAuth: computed,
    })
  }

  private refreshTokenTick () {
    container.get<IAuthService>(AuthServiceSymbol).refreshToken()
      .catch((e) => {
        console.warn(e)
      })
  }

  private startRefreshTokenInterval () {
    this.stopRefreshTokenInterval()
    this.refreshTokenInterval = setInterval(() => this.refreshTokenTick(), REFRESH_TOKEN_INTERVAL)
  }

  private stopRefreshTokenInterval () {
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval)
      this.refreshTokenInterval = undefined
    }
  }

  setUser (user: User, token?: string) {
    this.user = user
    this.token = token
    if (this.token) {
      this.startRefreshTokenInterval()
    }
  }

  setToken (token?: string): void {
    this.stopRefreshTokenInterval()
    this.token = token
    if (this.token) {
      this.startRefreshTokenInterval()
    }
  }

  clearUser () {
    this.user = undefined
    this.token = undefined
    this.stopRefreshTokenInterval()
  }

  get isAuth (): boolean {
    return !!this.user && !!this.token
  }


}
