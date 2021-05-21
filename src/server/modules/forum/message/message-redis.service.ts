import { Inject, Injectable } from '@nestjs/common'
import { REDIS_CLIENT } from '../../../di.symbols'
import { RedisClient } from '../../../types'
import {
  getKeyMessageHash,
  getKeyMessageLatestLevel,
  getKeyMessageTopicLevel,
  RedisMessageHash,
  toRedisMessageHash,
  zResultWithScoresToMap
} from '../../../common/utils/redis'
import { toStartStop } from '../../../common/utils/pagination'
import { UserLevel } from '../../../../common/forum/forum.constants'
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces'
import { uniqueArray } from '../../../../common/utils/array'


interface GetIdsTopicLastMessageProps {
  topicId: number,
  userLevel: UserLevel,
  pagination: IPaginationOptions,
  sorting?: 'asc' | 'desc'
}

interface GetIdsLatestProps {
  userLevel: UserLevel,
  pagination: IPaginationOptions
}

@Injectable()
export class MessageRedisService {
  constructor (
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
  }


  async getIdsTopicLastMessage (
    {
      topicId,
      userLevel,
      pagination,
      sorting = 'asc'
    }: GetIdsTopicLastMessageProps
  ) {
    const key = getKeyMessageTopicLevel(topicId, userLevel)
    const [start, stop] = toStartStop(pagination)
    const data = await (
      sorting === 'asc' ?
        this.redis.zrange(key, start, stop, 'WITHSCORES') :
        this.redis.zrevrange(key, start, stop, 'WITHSCORES')
    )
    return zResultWithScoresToMap(data)
  }

  getCountTopicLastMessage (
    {
      topicId,
      userLevel,
    }: Pick<GetIdsTopicLastMessageProps, 'userLevel' | 'topicId'>
  ) {
    const key = getKeyMessageTopicLevel(topicId, userLevel)
    return this.redis.zcard(key)
  }

  async getIdsLatest ({ userLevel, pagination }: GetIdsLatestProps) {
    const key = getKeyMessageLatestLevel(userLevel)
    const [start, stop] = toStartStop(pagination)
    const data = await this.redis.zrevrange(key, start, stop, 'WITHSCORES')
    return zResultWithScoresToMap(data)
  }

  getCountLatest ({ userLevel }: Pick<GetIdsLatestProps, 'userLevel'>) {
    const key = getKeyMessageLatestLevel(userLevel)
    return this.redis.zcard(key)
  }

  /// HASH SINGLE

  async getHashById (id: number): Promise<RedisMessageHash | undefined> {
    if (id <= 0) {
      return undefined
    }
    const key = getKeyMessageHash(id)
    const data = await this.redis.hgetall(key)
    return toRedisMessageHash(data)
  }

  /// HASH LIST

  async getHashListByIds (ids: number[]): Promise<Map<number, RedisMessageHash>> {
    const map: Map<number, RedisMessageHash> = new Map()
    const promises = uniqueArray(ids).map(id => this.getHashById(id))
    const data = await Promise.all(promises)
    data.forEach(item => item && item.id && map.set(item.id, item))
    return map
  }

  /// SAVE

  async saveHash (id: number, fields: Partial<RedisMessageHash>): Promise<boolean> {
    const key = getKeyMessageHash(id)
    const result = await this.redis.hset(key, fields as {})
    return result === 'OK'
  }

  /// OTHER

  async getOrdinalNumberInTopic (messageId: number, topicId: number, userLevel: UserLevel): Promise<number> {
    // zcount jq_s:message:topic:404:admin -Inf 227290
    const keyMessageTopicLevel = getKeyMessageTopicLevel(topicId, userLevel)
    // const ordinalNumber = await this.redis.zcount(keyMessageTopicLevel, '-Inf', messageId)
    const ordinalNumber = await this.redis.zrank(keyMessageTopicLevel, messageId + '')
    return ordinalNumber ?? 0
  }

}
