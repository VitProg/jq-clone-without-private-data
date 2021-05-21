import { IUser } from '../../../common/forum/forum.base.interfaces'
import { JwtRefreshTokenStrategyValidatePayload, JwtStrategyValidatePayload } from './types'
import { ExecutionContext } from '@nestjs/common'

export function lastLoginForJwt (lastLogin: Date | undefined) {
  return lastLogin ? (lastLogin.getTime() / 1000) >>> 0 : -1
}

export function userToJwtPayload (user: IUser, lastTime: number, fingerprintLight: any): Omit<JwtStrategyValidatePayload, 'exp' | 'iat'> {
  return {
    sub: user.id,
    login: user.login,
    lastTime,
    fingerprintLight: fingerprintLight,
  }
}

export function userToJwtRefreshPayload (user: IUser, fingerprintLight: any): Omit<JwtRefreshTokenStrategyValidatePayload, 'exp' | 'iat'> {
  return {
    sub: user.id,
    // login: user.login,
    // displayName: user.displayName,
    // url: user.url,
    // avatar: user.avatar,
    fingerprintLight: fingerprintLight,
  }
}


export const getUserFromContext = (ctx: ExecutionContext): IUser | undefined => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
}
