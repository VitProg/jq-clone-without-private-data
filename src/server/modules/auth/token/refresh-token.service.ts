import { Inject, Injectable } from '@nestjs/common'
import { REDIS_CLIENT } from '../../../di.symbols'
import { RedisClient } from '../../../types'
import { ConfigService } from '@nestjs/config'
import { convertSimpleExpiresToSeconds } from '../../../common/date'


const getKeyRefreshTokenList = (userId: number) => `auth:l:rt:${userId}`

type TokenItem = { token: string, fingerprint: string, time: number }

const serialize = (item: TokenItem) => JSON.stringify(item)

const deserialize = (str: string): Partial<TokenItem> => {
  try {
    return JSON.parse(str)
  } catch {
    return {
      token: undefined,
      fingerprint: undefined,
      time: -1,
    }
  }
}

@Injectable()
export class RefreshTokenService {

  constructor (
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
  }

  private get maxRefreshKeysByUser () {
    return (this.configService.get('MAX_REFRESH_TOKENS_BY_USER') ?? 10) >>> 0
  }

  private get expired () {
    return convertSimpleExpiresToSeconds(this.expiredString) ?? 0
  }
  private get expiredString () {
    return this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN', '')
  }

  private async getAllTokens (userId: number, _fingerprint: string | '*' = '*'): Promise<Array<TokenItem>> {
    const keyList = getKeyRefreshTokenList(userId)
    const data = await this.redis.lrange(keyList, 0, this.maxRefreshKeysByUser)
    const now = Date.now()

    const allKeys: Array<TokenItem> = []
    for (const item of data) {
      const { token, fingerprint, time } = deserialize(item)

      if (token && fingerprint && time) {
        if (time + (this.expired * 1000) < now) {
          console.log('remove expired', { token, fingerprint, time }, this.expired, now)
          await this.redis.lrem(keyList, 0, item)
        } else if (_fingerprint === '*' || fingerprint === _fingerprint) {
          allKeys.push({ token, fingerprint, time })
        }
      }
    }

    console.log('ltrim', await this.redis.ltrim(keyList, 0, this.maxRefreshKeysByUser - 1))

    return allKeys
  }

  async add (userId: number, fingerprint: string, token: string): Promise<number> {
    const time = Date.now()

    await this.removeByFingerprint(userId, fingerprint)

    const keyList = getKeyRefreshTokenList(userId)
    console.log('keyList', keyList)

    console.log('lpush', await this.redis.lpush(keyList, serialize({ token, fingerprint, time })))

    console.log(await this.getAllTokens(userId, '*'))

    return this.expired
  }

  async remove (userId: number, token: string) {
    const tokenItems = await this.getAllTokens(userId, '*')
    const keyList = getKeyRefreshTokenList(userId)
    for (const item of tokenItems) {
      if (item.token === token) {
        await this.redis.lrem(keyList, 0, serialize(item))
      }
    }
  }

  async removeByFingerprint (userId: number, fingerprint: string) {
    const tokenItems = await this.getAllTokens(userId, fingerprint)
    const keyList = getKeyRefreshTokenList(userId)
    for (const item of tokenItems) {
      await this.redis.lrem(keyList, 0, serialize(item))
    }
  }

  async removeByUser (userId: number) {
    const keyList = getKeyRefreshTokenList(userId)
    return await this.redis.del(keyList)
  }

  async has (userId: number, token: string) {
    const tokenItems = await this.getAllTokens(userId, '*')
    for (const item of tokenItems) {
      if (item.token === token) {
        return true
      }
    }
    return false
  }
}
