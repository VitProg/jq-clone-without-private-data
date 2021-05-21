import {
  BoardEntity,
  CategoryEntity,
  MemberEntity,
  MemberGroupEntity,
  MessageEntity,
  PermissionEntity,
  TopicEntity
} from '../../entities'
import {
  IBoard,
  ICategory,
  IMessage,
  IPermission,
  ITopic,
  IUser,
  IUserGroup
} from '../../../common/forum/forum.base.interfaces'
import { timestampToDate, toGender } from './transform'
import { MemberDisplayNameField, MemberEmailField, MemberLoginField } from '../../modules/forum/constants'
import { WithFields } from '../../modules/user/types'
import slug from 'slug'
import { getUserLevelsByGroups } from '../../../common/forum/utils'
import { UserLevel, userLevelsGroupIds } from '../../../common/forum/forum.constants'
import { splitPipedNumbers } from '../../../common/utils/string'
import { uniqueArray } from '../../../common/utils/array'


function entityListToMap<E, O extends { id: number }> (
  entityList: E[],
  toObjectFunction?: (entity: E, ...args: any[]) => O,
  ...args: any[]
): Map<number, O> {
  const map = new Map<number, O>()
  entityList.forEach(entity => {
    const obj = toObjectFunction ?
      toObjectFunction(entity, ...args) :
      entity as any
    map.set(obj.id >>> 0, obj)
  })
  return map
}

export const toMap = <E extends { id: number }> (list: E[]) => entityListToMap<E, E>(list)


export function toUser (member: MemberEntity, withFields: WithFields = [], withRaw = false): IUser {
  const groupIds: Set<number> = new Set<number>()

  if (member.idGroup > 0) {
    groupIds.add(member.idGroup)
  }
  const addGroups = splitPipedNumbers(member.additionalGroups)
  for (const addGroup of addGroups) {
    groupIds.add(addGroup)
  }
  const groups = [0, ...groupIds.values()]

  const login = member[MemberLoginField]
  const displayName = member[MemberDisplayNameField].split('&amp;').join('&')

  const user: IUser = {
    id: member.idMember,
    //email
    login,
    displayName,
    // url: member.urlName ?? slug((member[MemberDisplayNameField] ?? member[MemberLoginField]).substr(0, 80)),
    url: slug(displayName ?? login).substr(0, 80),
    avatar: member.avatar,
    gender: toGender(member.gender),
    dates: {
      lastLogin: member.lastLogin ? new Date(member.lastLogin * 1000) : undefined,
      registered: new Date(member.dateRegistered * 1000)
    },
    statistics: {
      posts: member.posts,
      karmaPlus: member.karmaGood,
      karmaMinus: member.karmaBad,
    },
    settings: {
      groupIds: groups,
      timeOffset: member.timeOffset,
    },
    flags: {
      isActivated: !!member.isActivated
    },
    level: getUserLevelsByGroups(groups).pop() ?? UserLevel.level1,
  }

  if (withFields.includes('auth')) {
    user.auth = {
      passwordHash: member.passwd,
      salt: member.passwordSalt,
    }
  }

  if (withFields.includes('email')) {
    user.email = member[MemberEmailField]
  }

  if (withRaw) {
    user.__raw = member
  }

  return user
}


export const toUserMap = (memberEntityList: MemberEntity[], withFields: WithFields = [], withRaw = false) => entityListToMap(memberEntityList, toUser, withFields, withRaw)


export function toMessage (message: MessageEntity): IMessage {
  return {
    id: message.idMsg,
    body: message.body,
    dates: {
      createdAt: timestampToDate(message.posterTime),
      updatedAt: timestampToDate(message.modifiedTime),
    },
    flags: {
      isApproved: !!message.approved,
    },
    linksId: {
      user: message.idMember,
      topic: message.idTopic,
      board: message.idBoard,
    },
    statistics: {
      ratePlus: message.nRateGood,
      rateMinus: message.nRateBad,
    },
  }
}

export const toMessageMap = (messageEntityList: MessageEntity[]) => entityListToMap(messageEntityList, toMessage)


export function toTopic (topic: TopicEntity & { subject: string }): ITopic {
  const subject = topic.subject ?? `topic-${topic.idTopic}`
  return {
    id: topic.idTopic,
    // url: topic.url ?? slug(topic.subject.substr(0, 80)),
    url: slug(subject.substr(0, 80)),
    subject: subject ?? `topic-${topic.idTopic}`,
    flags: {
      isLocked: !!topic.locked,
      isSticky: !!topic.isSticky,
      isApproved: !!topic.approved,
      isStickyFirstPost: !!topic.isStickyFirstPost,
    },
    linksId: {
      board: topic.idBoard,
      poll: topic.idPoll > 0 ? topic.idPoll : undefined,
      firstMessage: topic.idFirstMsg,
      lastMessage: topic.idLastMsg,
    },
    counters: {
      messages: topic.numReplies,
    }
  }
}

export const toTopicMap = (topicEntityList: Array<TopicEntity & { subject: string }>) => entityListToMap(topicEntityList, toTopic)


export function toBoard (board: BoardEntity): IBoard {
  const forGroups = uniqueArray([
    ...userLevelsGroupIds[UserLevel.admin],
    ...userLevelsGroupIds[UserLevel.moderator],
    ...splitPipedNumbers(board.memberGroups),
  ]).sort((a, b) => a - b)

  return {
    id: board.idBoard,
    // url: board.url ?? slug(board.name.substr(0, 80)),
    url: slug(board.name.substr(0, 80)),
    name: board.name,
    description: board.description,
    notice: board.noticeDescription ? board.noticeDescription : undefined,
    onlyIndexNotice: board.isOnlyIndexMessage ? board.isOnlyIndexMessage! : undefined,
    settings: {
      forGroups,
      onlyIndexGroups: splitPipedNumbers(board.memberGroupsOnlyIndex).sort((a, b) => a - b),
      order: board.boardOrder,
      level: board.childLevel,
      hidden: !!board.hidden,
    },
    linksId: {
      parent: board.idParent,
      category: board.idCat,
      lastMessage: board.idLastMsg,
    },
    counters: {
      messages: board.numPosts,
      topics: board.numTopics,
    },
  }
}

export const toBoardMap = (boardEntityList: BoardEntity[]) => entityListToMap(boardEntityList, toBoard)


export function toCategory (category: CategoryEntity): ICategory {
  return {
    id: category.idCat,
    name: category.name,
    settings: {
      order: category.catOrder,
    }
  }
}

export const toCategoryMap = (categoryEntityList: CategoryEntity[]) => entityListToMap(categoryEntityList, toCategory)


export function toUserGroup (group: MemberGroupEntity): IUserGroup {
  const result: IUserGroup = {
    id: group.idGroup,
    name: group.groupName,
  }

  if (group.onlineColor) {
    result.color = group.onlineColor
  }

  if (group.maxMessages > 0) {
    result.maxMessages = group.maxMessages
  }

  if (group.minPosts >= 0) {
    result.minPosts = group.minPosts
  }

  return result
}

export const toUserGroupMap = (groupEntityList: MemberGroupEntity[]) => entityListToMap(groupEntityList, toUserGroup)

export function toPermission (permission: PermissionEntity): IPermission {
  return {
    name: permission.permission,
    groupId: permission.idGroup,
  }
}

type ITEM<WO extends true | false> = WO extends true ? IPermission : string
type RET<WO extends true | false> = Map<number, Array<ITEM<WO>>>

export const toPermissionByGroupsMap =
  <WO extends true | false> (
    permissionEntityList: PermissionEntity[],
    withPermissionObject: WO
  ): RET<WO> => {
    const map: RET<WO> = new Map<number, Array<ITEM<WO>>>()

    for (const permissionEntity of permissionEntityList) {
      const permission = withPermissionObject ?
        toPermission(permissionEntity) :
        permissionEntity.permission
      const array: Array<ITEM<WO>> = []

      if (map.has(permissionEntity.idGroup)) {
        array.push(...map.get(permissionEntity.idGroup)!)
      }
      array.push(permission as ITEM<WO>)
      map.set(permissionEntity.idGroup, array)
    }
    return map
  }
