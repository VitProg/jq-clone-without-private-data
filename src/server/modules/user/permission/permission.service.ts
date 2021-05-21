import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { IUser } from '../../../../common/forum/forum.base.interfaces'
import { isArray, isMap, isObject } from '../../../../common/type-guards'
import { PermissionEntity } from '../../../entities'
import { walkByAny } from '../../../../common/utils/common'
import { toPermission, toPermissionByGroupsMap } from '../../../common/utils/mapper'
import { ForumCacheService } from '../../forum/forum-cache/forum-cache.service'


@Injectable()
export class PermissionService {

  constructor (
    private forumCacheService: ForumCacheService
  ) {
  }


  async getByUser (user: IUser) {
    const permissionMap = await this.forumCacheService.getPermissionByGroupMap()
    const groupIds = [-1, 0, ...user.settings.groupIds]
    const groups: string[] = []
    for (const groupId of groupIds) {
      groups.push(...(permissionMap.get(groupId) ?? []))
    }
    return groups
  }

  check (permissions: string, ...check: string[]) {
    return check.every(g => permissions.includes(g))
  }

  /**
   * mutable!
   * @param users
   */
  async fillForUsers<IN extends Map<number, IUser> | Record<number, IUser> | IUser[]>(users: IN): Promise<IN> {
    for (let user of walkByAny(users)) {
      user.settings.permissions = await this.getByUser(user)
    }

    return users
  }
}
