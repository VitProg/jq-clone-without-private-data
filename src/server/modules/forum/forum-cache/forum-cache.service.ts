import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BoardEntity, CategoryEntity, MemberGroupEntity, PermissionEntity } from '../../../entities'
import { IBoard, ICategory, IUserGroup } from '../../../../common/forum/forum.base.interfaces'
import { Repository } from 'typeorm'
import { toBoardMap, toCategoryMap, toMap, toPermissionByGroupsMap, toUserGroupMap } from '../../../common/utils/mapper'
import { safeJsonParse } from '../../../../common/utils/json'
import { REDIS_CLIENT } from '../../../di.symbols'
import { RedisClient } from '../../../types'
import { isArray, isMap } from '../../../../common/type-guards'


const BOARDS_KEY = 'cache:boards.'
const CATEGORIES_KEY = 'cache:categories.'
const USER_GROUPS_KEY = 'cache:groups.'
const PERMISSIONS_KEY = 'cache:permissions.'

const EXPIRED = 3600 // 1 hour
const EXPIRED_LOCAL = 300 // 5 min

const PERMISSIONS_EXPIRED = 300 // 5 min
const PERMISSIONS_EXPIRED_LOCAL = 240 // 4 min

enum Types {
  category = 'category',
  board = 'board',
  userGroup = 'userGroup',
  permission = 'permission',
}

@Injectable()
export class ForumCacheService {

  private _getBoardMap: Map<number, IBoard> = new Map<number, IBoard>()
  private _getCategoryMap: Map<number, ICategory> = new Map<number, ICategory>()
  private _getUserGroupMap: Map<number, IUserGroup> = new Map<number, IUserGroup>()
  private _getPermissionByGroupMap: Map<number, string[]> = new Map<number, string[]>()

  private expiredAt: Record<Types, number> = {
    [Types.category]: 0,
    [Types.board]: 0,
    [Types.userGroup]: 0,
    [Types.permission]: 0,
  }
  private refreshing = false

  readonly refreshMethods: Record<Types, keyof this> = {
    [Types.category]: 'refreshCategories',
    [Types.board]: 'refreshBoards',
    [Types.userGroup]: 'refreshUserGroups',
    [Types.permission]: 'refreshPermissions',
  }

  constructor (
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(MemberGroupEntity) private readonly memberGroupRepository: Repository<MemberGroupEntity>,
    @InjectRepository(PermissionEntity) private readonly permissionRepository: Repository<PermissionEntity>,
  ) {
  }

  //todo add auto refresh when expired


  async refresh (force = false) {
    console.log('ForumCache refresh...')

    this.refreshing = true

    const now = Date.now()

    for (const type of Object.values(Types)) {
      if (force || this.expiredAt[type] > now) {
        try {
          await (this[this.refreshMethods[type]] as any)()
        } catch (e) {
          console.warn(e)
          await (this[this.refreshMethods[type]] as any)(true)
        }
      }
    }

    this.refreshing = false

    console.log('ForumCache refresh complete')
  }

  async refreshCategories (forceFromDb = false) {
    const redisData = await this.redis.get(CATEGORIES_KEY)
    const fromRedis = forceFromDb ? undefined : safeJsonParse<ICategory[]>(redisData)
    if (fromRedis && isArray(fromRedis)) {
      console.log(' - categories from redis')
      this._getCategoryMap = toMap(fromRedis)
    } else {
      console.log(' - categories from DB', forceFromDb)
      const entityList = await this.categoryRepository.find({
        order: {
          catOrder: 'ASC'
        }
      })
      this._getCategoryMap = toCategoryMap(entityList)
      const result = await this.redis.setex(CATEGORIES_KEY, EXPIRED, JSON.stringify([...this._getCategoryMap.values()]))
      console.log(' - - save to redis result', result)
    }
    this.expiredAt[Types.category] = Date.now() + EXPIRED_LOCAL * 1000
  }

  async refreshBoards (forceFromDb = false) {
    const redisData = await this.redis.get(BOARDS_KEY)
    const fromRedis = forceFromDb ? undefined : safeJsonParse<IBoard[]>(redisData)
    if (fromRedis && isArray(fromRedis)) {
      console.log(' - boards from redis')
      this._getBoardMap = toMap(fromRedis)
    } else {
      console.log(' - boards from DB', forceFromDb)
      const entityList = await this.boardRepository.find({
        // where: {
        //   hidden: 0
        // },
        order: {
          boardOrder: 'ASC'
        }
      })
      this._getBoardMap = toBoardMap(entityList)
      Object.values(this._getBoardMap).forEach(board => board.category = this._getCategoryMap.get(board.linksId.category))
      const result = await this.redis.setex(BOARDS_KEY, EXPIRED, JSON.stringify([...this._getBoardMap.values()]))
      console.log(' - - save to redis result', result)
    }
    this.expiredAt[Types.board] = Date.now() + EXPIRED_LOCAL * 1000
  }

  async refreshUserGroups (forceFromDb = false) {
    const redisData = await this.redis.get(USER_GROUPS_KEY)
    const fromRedis = forceFromDb ? undefined : safeJsonParse<IUserGroup[]>(redisData)
    if (fromRedis && isArray(fromRedis)) {
      console.log(' - user groups from redis')
      this._getUserGroupMap = toMap(fromRedis)
    } else {
      console.log(' - user groups from DB', forceFromDb)
      const entityList = await this.memberGroupRepository.find()
      this._getUserGroupMap = toUserGroupMap(entityList)
      const result = await this.redis.setex(USER_GROUPS_KEY, EXPIRED, JSON.stringify([...this._getUserGroupMap.values()]))
      console.log(' - - save to redis result', result)
    }
    this.expiredAt[Types.userGroup] = Date.now() + EXPIRED_LOCAL * 1000
  }

  async refreshPermissions (forceFromDb = false) {
    let fromRedis: Map<number, string[]> | undefined

    if (!forceFromDb) {
      try {
        const redisData = safeJsonParse<any>(await this.redis.get(PERMISSIONS_KEY))
        fromRedis = redisData && new Map<number, string[]>(redisData)
      } catch {
      }
    }

    if (fromRedis && isMap(fromRedis)) {
      console.log(' - permissions from redis')
      this._getPermissionByGroupMap = fromRedis
    } else {
      console.log(' - permissions from DB', forceFromDb)
      const entityList = await this.permissionRepository.find()
      this._getPermissionByGroupMap = toPermissionByGroupsMap(entityList, false)
      const entries: any = [...this._getPermissionByGroupMap.entries()]
      const result = await this.redis.setex(PERMISSIONS_KEY, EXPIRED, JSON.stringify(entries))
      console.log(' - - save to redis result', result)

    }
    this.expiredAt[Types.permission] = Date.now() + EXPIRED_LOCAL * 1000

  }

  protected refreshIfNeeded (type: Types) {
    const now = Date.now()
    if (this.expiredAt[type] < now && !this.refreshing) {
      console.log('ForumCache refresh by ', type, this.expiredAt[type], now, this.refreshing)
      this.refresh().catch(e => console.warn(e))
    }
  }

  async getCategoryMap (): Promise<ReadonlyMap<number, Readonly<ICategory>>> {
    await this.refreshIfNeeded(Types.category)
    return this._getCategoryMap
  }

  async getBoardMap (): Promise<ReadonlyMap<number, Readonly<IBoard>>> {
    await this.refreshIfNeeded(Types.board)
    return this._getBoardMap
  }

  async getUserGroupMap (): Promise<ReadonlyMap<number, Readonly<IUserGroup>>> {
    await this.refreshIfNeeded(Types.userGroup)
    return this._getUserGroupMap
  }

  async getPermissionByGroupMap (): Promise<ReadonlyMap<number, ReadonlyArray<string>>> {
    await this.refreshIfNeeded(Types.permission)
    return this._getPermissionByGroupMap
  }

}
