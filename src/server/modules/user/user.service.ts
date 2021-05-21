import { Injectable } from '@nestjs/common'
import { UserDbService } from './user-db.service'
import { UserRedisService } from './user-redis.service'
import { IUserEx } from '../../../common/forum/forum.ex.interfaces'
import { toUserEx } from '../../common/utils/mapper-ex'
import { uniqueArray } from '../../../common/utils/array'


@Injectable()
export class UserService {
  constructor (
    private readonly db: UserDbService,
    private readonly redis: UserRedisService,
  ) {
  }

  async findById (id: number): Promise<IUserEx | undefined> {
    const data = await this.redis.getHashById(id)
    return data ? toUserEx(data) : undefined
  }

  async findByIdsToMap (ids: number[] | Set<number>): Promise<Map<number, IUserEx>> {
    const hashMap = await this.redis.getHashListByIds([...ids])
    const resultMap: Map<number, IUserEx> = new Map()
    for (const [id, hash] of hashMap) {
      resultMap.set(id, toUserEx(hash))
    }
    return resultMap
  }

  async findByIds (ids: number[] | Set<number>): Promise<IUserEx[]> {
    const hashMap = await this.redis.getHashListByIds([...ids])
    return [...hashMap.values()].map(hash => toUserEx(hash))
  }

  async findByNames (name: string[] | Set<string>): Promise<IUserEx[]> {
    const ids = await this.redis.getIdsByNames(uniqueArray(name))
    return this.findByIds(ids)
  }

}
