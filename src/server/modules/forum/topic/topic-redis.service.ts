import { Inject, Injectable } from '@nestjs/common'
import { UserLevel } from '../../../../common/forum/forum.constants'
import { RedisClient, Sorting } from '../../../types'
import {
  getKeyTopicBoardLevel,
  getKeyTopicBoardNumMessagesLevel,
  getKeyTopicHash,
  getKeyTopicLatestLevel,
  getKeyTopicStatHash,
  RedisTopicFullHash,
  RedisTopicHash,
  RedisTopicStatHash,
  toRedisTopicHash, toRedisTopicHashRequired,
  toRedisTopicStatHashRequired,
  zResultWithScoresToMap
} from '../../../common/utils/redis'
import { uniqueArray } from '../../../../common/utils/array'
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces'
import { REDIS_CLIENT } from '../../../di.symbols'
import { toStartStop } from '../../../common/utils/pagination'


interface GetIdsLastMessageProps {
  userLevel: UserLevel
  boardId: number
  pagination: IPaginationOptions
  sorting?: Sorting
  stickyFirst?: boolean
}

interface GetIdsCountMessageProps {
  userLevel: UserLevel
  boardId: number
  pagination: IPaginationOptions
  sorting?: Sorting
  stickyFirst?: boolean
}

interface GetIdsLatestProps {
  userLevel: UserLevel
  pagination: IPaginationOptions
}

@Injectable()
export class TopicRedisService {
  constructor (
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
  }

  async getIdsLastMessage (
    {
      boardId,
      userLevel,
      pagination,
      sorting = 'desc',
      stickyFirst = false /* todo */
    }: GetIdsLastMessageProps
  ): Promise<Map<number, number>> {
    const key = getKeyTopicBoardLevel(boardId, userLevel)
    const [start, stop] = toStartStop(pagination)
    const data = await (
      sorting === 'asc' ?
        this.redis.zrange(key, start, stop, 'WITHSCORES') :
        this.redis.zrevrange(key, start, stop, 'WITHSCORES')
    )
    return zResultWithScoresToMap(data)
  }

  async getCountLastMessage (
    {
      boardId,
      userLevel,
    }: Pick<GetIdsLastMessageProps, 'userLevel' | 'boardId'>
  ): Promise<number> {
    const key = getKeyTopicBoardLevel(boardId, userLevel)
    return this.redis.zcard(key)
  }

  async getIdsCountMessage (
    {
      boardId,
      userLevel,
      pagination,
      sorting = 'desc',
      stickyFirst = false /* todo */
    }: GetIdsCountMessageProps
  ): Promise<Map<number, number>> {
    const key = getKeyTopicBoardNumMessagesLevel(boardId, userLevel)
    const [start, stop] = toStartStop(pagination)
    const data = await (
      sorting === 'asc' ?
        this.redis.zrange(key, start, stop, 'WITHSCORES') :
        this.redis.zrevrange(key, start, stop, 'WITHSCORES')
    )
    return zResultWithScoresToMap(data)
  }

  async getCountCountMessage (
    {
      boardId,
      userLevel,
    }: Pick<GetIdsCountMessageProps, 'userLevel' | 'boardId'>
  ): Promise<number> {
    const key = getKeyTopicBoardNumMessagesLevel(boardId, userLevel)
    return this.redis.zcard(key)
  }

  async getIdsLatest ({ userLevel, pagination }: GetIdsLatestProps): Promise<Map<number, number>> {
    const key = getKeyTopicLatestLevel(userLevel)
    const [start, stop] = toStartStop(pagination)
    const data = await this.redis.zrevrange(key, start, stop, 'WITHSCORES')
    return zResultWithScoresToMap(data)
  }

  async getCountLatest (
    { userLevel }: Pick<GetIdsLatestProps, 'userLevel'>
  ): Promise<number> {
    const key = getKeyTopicLatestLevel(userLevel)
    return this.redis.zcard(key)
  }


  /// HASH SINGLE

  async getHashById (id: number): Promise<RedisTopicHash | undefined> {
    if (id <= 0) {
      return undefined
    }
    const key = getKeyTopicHash(id)
    const data = await this.redis.hgetall(key)

    return toRedisTopicHashRequired(data)
  }

  async getStatHashById (id: number, userLevel: UserLevel): Promise<RedisTopicStatHash | undefined> {
    if (id <= 0) {
      return undefined
    }
    const key = getKeyTopicStatHash(id, userLevel)
    const data = await this.redis.hgetall(key)
    return toRedisTopicStatHashRequired(data)
  }

  async getFullHashById (id: number, userLevel: UserLevel): Promise<RedisTopicFullHash | undefined> {
    if (id <= 0) {
      return undefined
    }
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

  async getHashListByIds (ids: number[]): Promise<Map<number, RedisTopicHash>> {
    const map: Map<number, RedisTopicHash> = new Map()
    const promises = uniqueArray(ids).map(id => this.getHashById(id))
    const data = await Promise.all(promises)
    data.forEach(item => item && item.id && map.set(item.id, item))
    return map
  }

  async getStatHashListByIds (ids: number[], userLevel: UserLevel): Promise<Map<number, RedisTopicStatHash>> {
    const map: Map<number, RedisTopicStatHash> = new Map()
    const promises = uniqueArray(ids).map(id => this.getStatHashById(id, userLevel))
    const data = await Promise.all(promises)
    data.forEach(item => item && item.id && map.set(item.id, item))
    return map
  }

  async getFullHashListByIds (ids: number[], userLevel: UserLevel): Promise<Map<number, RedisTopicFullHash>> {
    const map: Map<number, RedisTopicFullHash> = new Map()
    const promises = uniqueArray(ids).map(id => this.getFullHashById(id, userLevel))
    const data = await Promise.all(promises)
    data.forEach(item => item && item.id && map.set(item.id, item))
    return map
  }

  /// SAVE

  async saveHash (id: number, fields: Partial<RedisTopicHash>): Promise<boolean> {
    const key = getKeyTopicHash(id)
    const result = await this.redis.hset(key, fields as {})
    return result === 'OK'
  }

  async saveStatHash (id: number, userLevel: UserLevel, fields: Partial<RedisTopicStatHash>): Promise<boolean> {
    const key = getKeyTopicStatHash(id, userLevel)
    const result = await this.redis.hset(key, fields as {})
    return result === 'OK'
  }
}
