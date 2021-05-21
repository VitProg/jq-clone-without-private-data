import { Inject, Injectable } from '@nestjs/common'
import { REDIS_CLIENT } from '../../di.symbols'
import { RedisClient } from '../../types'
import {
  getKeyUserHash, getKeyUserHashNameToId,
  RedisUserHash,
  toRedisUserHash
} from '../../common/utils/redis'
import { uniqueArray } from '../../../common/utils/array'
import { toInt } from '../../../common/utils/number'
import { isNumber } from '../../../common/type-guards'


@Injectable()
export class UserRedisService {
  constructor (
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
  }

  async getHashById (id: number): Promise<RedisUserHash | undefined> {
    const key = getKeyUserHash(id)
    const data = await this.redis.hgetall(key)
    return toRedisUserHash(data)
  }

  /// HASH LIST

  async getHashListByIds (ids: number[]): Promise<Map<number, RedisUserHash>> {
    const map: Map<number, RedisUserHash> = new Map()
    const promises = uniqueArray(ids).map(id => this.getHashById(id))
    const data = await Promise.all(promises)
    data.forEach(item => item && item.id && map.set(item.id, item))
    return map
  }

  async getIdsByNames (names: string[]): Promise<Array<number>> {
    const key = getKeyUserHashNameToId()
    const lowerNames = names.map(n => n.toLowerCase())

    const ids = await this.redis.hmget(key, lowerNames)

    return ids
      .map(toInt)
      .filter(id => isNumber(id) && id > 0)
  }
}
