import { Inject, Injectable } from '@nestjs/common'
import { REDIS_CLIENT } from '../../../di.symbols'
import { RedisClient, Sorting } from '../../../types'
import { UserLevel } from '../../../../common/forum/forum.constants'
import {
  getKeyBoardHash,
  getKeyBoardNumMessagesLevel,
  getKeyBoardNumTopicsLevel,
  getKeyBoardOrderedLevel,
  getKeyBoardStatHash,
  RedisBoardFullHash,
  RedisBoardHash,
  RedisBoardStatHash,
  toRedisBoardHashRequired,
  toRedisBoardStatHashRequired,
  zResultToArray,
  zResultWithScoresToMap
} from '../../../common/utils/redis'
import { uniqueArray } from '../../../../common/utils/array'
import { MAX_NUMBER } from '../../../../common/utils/number'


@Injectable()
export class BoardRedisService {
  constructor (
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
  }

  async getIds (userLevel: UserLevel, sorting: Sorting = 'asc'): Promise<number[]> {
    const key = getKeyBoardOrderedLevel(userLevel)
    const data = await (
      sorting === 'asc' ?
        this.redis.zrange(key, 0, MAX_NUMBER) :
        this.redis.zrevrange(key, 0, MAX_NUMBER)
    )
    return zResultToArray(data)
  }

  async getIdsCountMessage (userLevel: UserLevel, sorting: Sorting = 'desc'): Promise<Map<number, number>> {
    const key = getKeyBoardNumMessagesLevel(userLevel)
    const data = await (
      sorting === 'asc' ?
        this.redis.zrange(key, 0, MAX_NUMBER, 'WITHSCORES') :
        this.redis.zrevrange(key, 0, MAX_NUMBER, 'WITHSCORES')
    )
    return zResultWithScoresToMap(data)
  }

  async getIdsCountTopics (userLevel: UserLevel, sorting: Sorting = 'desc'): Promise<Map<number, number>> {
    const key = getKeyBoardNumTopicsLevel(userLevel)
    const data = await (
      sorting === 'asc' ?
        this.redis.zrange(key, 0, MAX_NUMBER, 'WITHSCORES') :
        this.redis.zrevrange(key, 0, MAX_NUMBER, 'WITHSCORES')
    )
    return zResultWithScoresToMap(data)
  }

  /// HASH SINGLE

  async getHashById (id: number): Promise<RedisBoardHash | undefined> {
    const key = getKeyBoardHash(id)
    const data = await this.redis.hgetall(key)
    return toRedisBoardHashRequired(data)
  }

  async getStatHashById (id: number, userLevel: UserLevel): Promise<RedisBoardStatHash | undefined> {
    const key = getKeyBoardStatHash(id, userLevel)
    const data = await this.redis.hgetall(key)
    return toRedisBoardStatHashRequired(data)
  }

  async getFullHashById (id: number, userLevel: UserLevel): Promise<RedisBoardFullHash | undefined> {
    const [hash, statHash] = await Promise.all([
      this.getHashById(id),
      this.getStatHashById(id, userLevel),
    ])

    if (hash && statHash) {
      return {
        ...hash,
        ...statHash,
      }
    }
  }

  /// HASH LIST

  async getHashListByIds (ids: number[]): Promise<Map<number, RedisBoardHash>> {
    const map: Map<number, RedisBoardHash> = new Map()
    const promises = uniqueArray(ids).map(id => this.getHashById(id))
    const data = await Promise.all(promises)
    data.forEach(item => item && item.id && map.set(item.id, item))
    return map
  }

  async getStatHashListByIds (ids: number[], userLevel: UserLevel): Promise<Map<number, RedisBoardStatHash>> {
    const map: Map<number, RedisBoardStatHash> = new Map()
    const promises = uniqueArray(ids).map(id => this.getStatHashById(id, userLevel))
    const data = await Promise.all(promises)
    data.forEach(item => item && item.id && map.set(item.id, item))
    return map
  }

  async getFullHashListByIds (ids: number[], userLevel: UserLevel): Promise<Map<number, RedisBoardFullHash>> {
    const map: Map<number, RedisBoardFullHash> = new Map()
    const promises = uniqueArray(ids).map(id => this.getFullHashById(id, userLevel))
    const data = await Promise.all(promises)
    data.forEach(item => item && item.id && map.set(item.id, item))
    return map
  }

  /// SAVE

  async saveHash (id: number, fields: Partial<RedisBoardHash>): Promise<boolean> {
    const key = getKeyBoardHash(id)
    const result = await this.redis.hset(key, fields as {})
    return result === 'OK'
  }

  async saveStatHash (id: number, userLevel: UserLevel, fields: Partial<RedisBoardStatHash>): Promise<boolean> {
    const key = getKeyBoardStatHash(id, userLevel)
    const result = await this.redis.hset(key, fields as {})
    return result === 'OK'
  }

}
