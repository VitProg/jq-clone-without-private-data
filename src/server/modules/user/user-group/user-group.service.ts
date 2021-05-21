import { Injectable } from '@nestjs/common';
import { ForumCacheService } from '../../forum/forum-cache/forum-cache.service'
import { IUser, IUserGroup } from '../../../../common/forum/forum.base.interfaces'
import { walkByAny } from '../../../../common/utils/common'


@Injectable()
export class UserGroupService {

  constructor (
    private forumCacheService: ForumCacheService
  ) {
  }

  async getByUser (user: IUser): Promise<Array<Readonly<IUserGroup>>> {
    const userGroupMap = await this.forumCacheService.getUserGroupMap()

    const groups = user.settings.groupIds
      .map(id => userGroupMap.get(id))
      .filter(Boolean) as Array<Readonly<IUserGroup>>

    groups.push(...(await this.getGroupsByUserStatistics(user.statistics)))

    return groups
  }

  async getGroupsByUserStatistics(statistics: IUser['statistics']) {
    const userGroupMap = await this.forumCacheService.getUserGroupMap()
    const userGroupArray = [...userGroupMap.values()]

    let groupByPosts: IUserGroup | undefined
    let groupByKarma: IUserGroup | undefined
    let postsI = 0

    for (const group of userGroupArray) {
      if (group.minPosts && statistics.posts >= group.minPosts && postsI < group.minPosts) {
        groupByPosts = group
        postsI = group.minPosts
      }
    }

    //todo by karma

    const groups: IUserGroup[] = []
    if (groupByPosts) {
      groups.push(groupByPosts)
    }
    if (groupByKarma) {
      groups.push(groupByKarma)
    }
    return groups
  }

  userInGroups(user: IUser, ...groupIds: number[]) {
    return groupIds.every(g => user.settings.groupIds.includes(g))
  }

  /**
   * mutable!
   * @param users
   */
  async fillForUsers<IN extends Map<number, IUser> | Record<number, IUser> | IUser[]>(users: IN): Promise<IN> {
    for (let user of walkByAny(users)) {
      user.settings.groups = await this.getByUser(user)
    }

    return users
  }
}
