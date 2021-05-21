import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AttachmentEntity, MemberEntity } from '../../entities'
import { Equal, FindOperator, Repository, SelectQueryBuilder } from 'typeorm'
import { MemberEmailField, MemberIdField, MemberLoginField } from '../forum/constants'
import { toUser, toUserMap } from '../../common/utils/mapper'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'
import { IActiveUsersResponse, IForumUserManyResponse } from '../../../common/responses/forum.responses'
import { IUser } from '../../../common/forum/forum.base.interfaces'
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral'
import { PermissionService } from './permission/permission.service'
import { WithFields } from './types'
import { UserGroupService } from './user-group/user-group.service'
import { paginateRawAndEntities } from '../../common/paginate/paginate-raw-and-entities'

const DEFAULT_WITH_FIELDS: WithFields = []

@Injectable()
export class UserDbService {
  constructor (
    @InjectRepository(MemberEntity) private readonly memberRepository: Repository<MemberEntity>,
    private readonly permissionService: PermissionService,
    private readonly userGroupService: UserGroupService,
  ) {
    //
  }

  private query (): SelectQueryBuilder<MemberEntity> {
    return this.memberRepository
      .createQueryBuilder()
      .addSelect('a.filename as member_avatar')
      .leftJoin(AttachmentEntity, 'a', `a.id_member = ${MemberEntity.name}.id_member AND a.attachment_type = 1 AND a.approved = 1`)
      .where(`${MemberEntity.name}.is_spammer = 0`)
  }

  private async rawToArray (data: { entities: MemberEntity[], raw: any[] }, withFields: WithFields): Promise<IUser[]> {
    let items = data.entities
      .map((value: any, index: number) => ({
        ...value,
        avatar: data.raw[index]?.member_avatar,
      }))
      .map(m => toUser(m, withFields))

    if (withFields.includes('permissions')) {
      items = await this.permissionService.fillForUsers(items)
    }

    if (withFields.includes('groups')) {
      items = await this.userGroupService.fillForUsers(items)
    }

    return items
  }

  private async rawToMap (item: { entities: MemberEntity[], raw: any[] }, withFields: WithFields, withRaw = false) {
    let map = toUserMap(
      item.entities
        .map((value: any, index: number) => ({
          ...value,
          avatar: item.raw[index]?.member_avatar,
        })),
      withFields,
      withRaw,
    )

    if (withFields.includes('permissions')) {
      map = await this.permissionService.fillForUsers(map)
    }

    if (withFields.includes('groups')) {
      map = await this.userGroupService.fillForUsers(map)
    }

    return map
  }


  async findByIdsToMap (ids: number[] | Set<number>, withFields: WithFields = DEFAULT_WITH_FIELDS): Promise<Map<number, IUser>> {
    const idSet = new Set(ids)
    if (idSet.size === 0) {
      return new Map()
    }

    const query = this.query()

    if (idSet.size === 1) {
      const [id, ..._] = [...idSet.values()]
      query.where({
        idMember: Equal(id)
      })
    } else {
      query.whereInIds([...idSet])
    }

    const data = await query.getRawAndEntities()

    return await this.rawToMap(data, withFields)
  }

  async findByIds (ids: number[] | Set<number>, withFields: WithFields = DEFAULT_WITH_FIELDS): Promise<IUser[]> {
    return [...(await this.findByIdsToMap(ids, withFields)).values()]
  }

  async findByIdsToRecord (ids: number[] | Set<number>, withFields: WithFields = DEFAULT_WITH_FIELDS): Promise<Record<number, IUser>> {
    const map = await this.findByIdsToMap(ids, withFields)
    return Object.fromEntries(map.entries())
  }

  async fundByLogin (login: string, withFields: WithFields = DEFAULT_WITH_FIELDS) {
    return this.findByLoginOrEmail({ login }, withFields)
  }

  async findByEmail (email: string, withFields: WithFields = DEFAULT_WITH_FIELDS) {
    return this.findByLoginOrEmail({ email }, withFields)
  }

  async findById (id: number, withFields: WithFields = DEFAULT_WITH_FIELDS): Promise<IUser | undefined> {
    const data = await this.query()
      .where({ [MemberIdField]: id })
      .getRawAndEntities()

    const items = await this.rawToArray(data, withFields)
    return items?.[0]
  }

  async findByLoginOrEmail (config: { login?: string, email?: string }, withFields: WithFields = ['email', 'auth']) {
    const login = config.login?.trim()
    const email = config.email?.trim()

    if (!login && !email) {
      return undefined
    }

    let where: ObjectLiteral | Array<ObjectLiteral> = []

    if (login && email) {
      where = {
        [MemberLoginField]: login, [MemberEmailField]: email,
      }
    } else if (login) {
      where = { [MemberLoginField]: login }
    } else if (email) {
      where = { [MemberEmailField]: email }
    }

    const data = await this.query()
      .where(where)
      // .getRawOne()
      .getRawAndEntities()

    const items = await this.rawToArray(data, withFields)
    return items?.[0]
  }

  async findByName (name: string, withFields: WithFields = DEFAULT_WITH_FIELDS): Promise<IUser[]> {
    const data = await this.query()
      .orWhere(`${MemberEntity.name}.memberName = :name`, { name })
      .orWhere(`${MemberEntity.name}.real_name = :name`, { name })
      .getRawAndEntities()

    return this.rawToArray(data, withFields)
  }

  async getActiveUsers (options: IPaginationOptions, withFields: WithFields = DEFAULT_WITH_FIELDS): Promise<IActiveUsersResponse> {
    const query = this.query()
      .where({
        isSpammer: 0,
        posts: new FindOperator('moreThan', 0)
      })
      .orderBy({
        posts: 'DESC',
        last_login: 'DESC'
      })

    const mapper = (entities: MemberEntity[], raw: any[]) => this.rawToArray({ entities, raw }, withFields)

    return paginateRawAndEntities(
      query,
      options,
      (entities, raw) => this.rawToArray({ entities, raw }, withFields),
    )
  }


  findByRefreshToken (refreshToken: string, fingerprintLight: Promise<string>, userId: number) {
    return Promise.resolve(undefined)
  }

  async updateLastLogin (id: number) {
    return ((await this.memberRepository.update(
      {
        [MemberIdField]: id,
      },
      {
        lastLogin: () => 'unix_timestamp()',
      }
    )).affected ?? 0) > 0
  }

  async paginate (
    options: {
      pagination: IPaginationOptions,
    }
  ): Promise<IForumUserManyResponse> {
    const query = this.query()

    return await paginateRawAndEntities(
      query,
      options.pagination,
      (entities, raw) => this.rawToArray({ entities, raw }, DEFAULT_WITH_FIELDS)
    )
  }

  async findAllToMap (withFields: WithFields = DEFAULT_WITH_FIELDS, withRaw = false): Promise<Map<number, IUser>> {
    const data = await this.query()
      .getRawAndEntities()

    return this.rawToMap(data, withFields, withRaw)
  }
}
