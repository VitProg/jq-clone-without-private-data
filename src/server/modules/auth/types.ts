import { IUser } from '../../../common/forum/forum.base.interfaces'


export interface JwtStrategyValidatePayload {
  sub: number
  login: string
  lastTime: number
  iat: number
  exp: number
  fingerprintLight: any
}

export interface JwtRefreshTokenStrategyValidatePayload {
  sub: number
  fingerprintLight: any
}


export interface JwtSignPayload {
  user: Omit<IUser, 'auth' | 'email'>
  fingerprint: string
  fingerprintLight: string
}
