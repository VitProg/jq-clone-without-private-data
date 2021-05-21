import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request } from 'express'
import { UserDbService } from '../user/user-db.service'
import { omit } from '../../../common/utils/object'
import { JwtService } from '@nestjs/jwt'
import { IUser } from '../../../common/forum/forum.base.interfaces'
import { SecureService } from '../secure/secure.service'
import { userToJwtPayload, userToJwtRefreshPayload } from './utils'
import { ConfigService } from '@nestjs/config'
import { RefreshTokenService } from './token/refresh-token.service'
import { convertSimpleExpiresToSeconds } from '../../common/date'
import { REDIS_CLIENT } from '../../di.symbols'
import { RedisClient } from '../../types'
import { CookieOptions } from 'express-serve-static-core'
import { JwtTokenService } from './token/jwt-token.service'


@Injectable()
export class AuthService {
  constructor (
    private readonly configService: ConfigService,
    private readonly userService: UserDbService,
    private readonly jwtService: JwtService,
    private readonly secureService: SecureService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtTokenService: JwtTokenService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
    //
  }

  async validateUser (username: string, password: string): Promise<IUser | undefined> {
    const login = username.includes('@') ? undefined : username
    const email = username.includes('@') ? username : undefined

    const user = await this.userService.findByLoginOrEmail({ login, email })
    // console.log({login, email, password, user})
    if (!user || !user.auth?.passwordHash) {
      return undefined
    }

    const hash = this.secureService.sha1(user.login.toLowerCase() + password)

    if (hash === user.auth.passwordHash) {
      return omit(user, 'auth')
    }

    return undefined
  }

  protected async generateTokens (request: Request & { user: IUser }) {
    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('user empty')
    }

    const lastTime = (Date.now() / 1000) >>> 0
    const fingerprintLight = await this.secureService.generateFingerprintLight(request)
    await this.jwtTokenService.setLastTime(user.id, fingerprintLight, lastTime)

    const accessToken = this.jwtService.sign({
      ...userToJwtPayload(user, lastTime, fingerprintLight),
    }, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_SECRET_EXPIRES_IN'),
      algorithm: 'HS512'
    })

    const refreshToken = this.jwtService.sign({
      ...userToJwtRefreshPayload(user, fingerprintLight),
    }, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      algorithm: 'HS256'
    })

    const ex = await this.refreshTokenService.add(user.id, fingerprintLight, refreshToken)

    return {
      accessToken,
      refreshToken,
      ...(ex ? {
        cookie: this.getCookieOptions(ex),
      }: {}),
    }
  }

  private getCookieOptions(ex: number): CookieOptions & {name: string} {
    return {
      name: this.configService.get('JWT_REFRESH_TOKEN_COOKIE')!,
      path: '/api/auth/',
      domain: this.configService.get('COOKIE_DOMAIN', 'localhost'),
      maxAge: ex,
      secure:  !!this.configService.get('isProd'),
      httpOnly: true,
    }
  }

  async login (request: Request & { user: IUser }) {
    await this.logout(request)

    const tokens = await this.generateTokens(request)

    await this.userService.updateLastLogin(request.user.id)

    return tokens
  }

  async refreshToken (request: Request & { user: IUser }) {
    const tokens = await this.generateTokens(request)

    ///todo remove old refresh token

    return tokens
  }

  async logout (request: Request & { user: IUser }) {
    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('user empty')
    }

    const lastTime = (Date.now() / 1000) >>> 0
    const fingerprintLight = await this.secureService.generateFingerprintLight(request)
    await this.jwtTokenService.setLastTime(user.id, fingerprintLight, lastTime)
    await this.refreshTokenService.removeByFingerprint(user.id, fingerprintLight)

    return {
      cookie: this.getCookieOptions(-1)
    }
  }

  async logoutAll (request: Request & { user: IUser }) {
    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('user empty')
    }

    // const lastTime = (Date.now() / 1000) >>> 0
    // const fingerprintLight = await this.secureService.generateFingerprintLight(request)
    await this.jwtTokenService.removeByUser(user.id)
    await this.refreshTokenService.removeByUser(user.id)

    return {
      cookie: this.getCookieOptions(-1)
    }
  }


}
