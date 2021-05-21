import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { REDIS_CLIENT } from '../../../di.symbols'
import { RedisClient } from '../../../types'
import { ConfigService } from '@nestjs/config'
import { isArray } from '../../../../common/type-guards'
import { convertSimpleExpiresToSeconds } from '../../../common/date'
import { JwtStrategyValidatePayload } from '../types'
import { IUserEx } from '../../../../common/forum/forum.ex.interfaces'
import { toInt } from '../../../../common/utils/number'

const getKeyHash = (userId: number) => `auth:h:jwt-lt:${userId}`


@Injectable()
export class JwtTokenService {

  constructor (
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
  }

  private get expired () {
    return convertSimpleExpiresToSeconds(this.expiredString) ?? 60
  }
  private get expiredString () {
    return this.configService.get('JWT_SECRET_EXPIRES_IN', '')
  }

  async setLastTime (userId: number, fingerprint: string, lastTime: number) {
    const keyHash = getKeyHash(userId)
    await this.redis.hset(keyHash, fingerprint, lastTime)
  }

  async getLastTime (userId: number, fingerprint: string): Promise<number> {
    const keyHash = getKeyHash(userId)
    return toInt(await this.redis.hget(keyHash, fingerprint)) ?? 0
  }

  async removeByUser (userId: number) {
    const keyHash = getKeyHash(userId)
    await this.redis.del(keyHash)
  }

  async verify (
    tokenPayload: JwtStrategyValidatePayload,
    fingerprintLight: string,
    user?: IUserEx,
    failWhenNoUser = true,
  ) {
    if (fingerprintLight !== tokenPayload.fingerprintLight) {
      throw new UnauthorizedException('jwt - fingerprint not valid')
    }

    let userId = tokenPayload.sub

    if (!user && failWhenNoUser) {
      throw new UnauthorizedException('jwt - user not found')
    }

    if (user) {
      if (tokenPayload.sub !== user.id) {
        throw new UnauthorizedException('jwt - incorrect token [id]')
      }

      if (tokenPayload.login !== user.name) {
        throw new UnauthorizedException('jwt - incorrect token [login]')
      }

      userId = user.id
    }

    const lastTime = await this.getLastTime(userId, fingerprintLight)
    if (tokenPayload.lastTime.toString() !== lastTime.toString()) {
      throw new UnauthorizedException('jwt - incorrect token [lastTime]')
    }

    return true
  }
}
