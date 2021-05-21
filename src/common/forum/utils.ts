import { IUser } from './forum.base.interfaces'
import slug from 'slug'
import { UserLevel, userLevelsGroupIds } from './forum.constants'
import { IUserEx } from './forum.ex.interfaces'
import { isObject } from '../type-guards'
import { resetCleanupScheduleForTests } from 'mobx-react-lite/dist/utils/reactionCleanupTracking'


export const getUserGroups = (user?: IUser): number[] => {
  const groups = [-1]

  if (user) {
    groups.push(0)
    groups.push(...user.settings.groupIds)
  }

  return groups
}

export const getUserName = (user?: IUser | { name: string }, guestIfEmpty = true): string => {
  if (!user) {
    return guestIfEmpty ? 'Гость' : ''
  }
  if (isIUser(user)) {
    return user.displayName ?? user.login
  }
  return user.name
}

export const getUserSlug = (user?: IUser | { url: string }): string => {
  if (!user) {
    return ''
  }
  if (user.url) {
    return user.url
  }
  if (isIUser(user)) {
    return slug(getUserName(user), {
      lower: true,
    })
  }
  return user.url
}


const slugUrlRule = /([\w\d-_]+)-(\d+)/
export const serializeUrlSlugId = (value: {id: number, url: string} | undefined) => {
  if (!value) {
    return undefined
  }
  return `${value.url}-${value.id}`
}

export const deserializeUrlSlugId = (raw: string | undefined): {id: number, url: string} | undefined=> {
  if (!raw) {
    return undefined
  }
  const match = slugUrlRule.exec(raw)
  if (match && match.length === 3) {
    const id = parseInt(match[2])
    const url = match[1]
    if (id > 0 && url) {
      return {
        id,
        url,
      }
    }
  }
  return undefined
}



export const getUserLevelsByGroups = (groups?: number[]): UserLevel[] => {
  if (!groups || groups.length <= 0) {
    return [UserLevel.guest]
  }

  const levels: UserLevel[] = []

  for (const entry of Object.entries(userLevelsGroupIds)) {
    const [level, groupIds] = entry as [UserLevel, number[]]
    const check = groupIds.length > 0 && groups.some(g => groupIds.includes(g))
    if (check && !levels.includes(level)) {
      levels.push(level)
    }
  }

  return levels
}

// todo optimize
export const getUserLevel = (user?: IUser | IUserEx): UserLevel => {
  if (!user) {
    return UserLevel.guest
  }
  if ((user as IUser)?.level) {
    return (user as IUser)?.level
  }
  if ((user as IUser)?.settings?.groupIds) {
    getUserLevelByGroups((user as IUser)?.settings.groupIds)
  }
  if ((user as IUserEx).settings.level) {
    return (user as IUserEx).settings.level
  }
  if ((user as IUserEx).settings.groups) {
    return getUserLevelByGroups((user as IUserEx).settings.groups)
  }
  return UserLevel.guest
}

export const getUserLevelByGroups = (groups?: number[]): UserLevel => getUserLevelsByGroups(groups)?.pop() ?? UserLevel.guest


export const checkUserLevelAccessByGroups = (to: UserLevel, groups?: number[]): boolean => {
  if (!groups || !groups.length) {
    return to === UserLevel.guest
  }

  for (const entry of Object.entries(userLevelsGroupIds)) {
    const [level, groupIds] = entry as [UserLevel, number[]]
    const check = groupIds.length > 0 && groups.some(g => groupIds.includes(g))
    if (check && level === to) {
      return true
    }
  }

  return false
}


export const isIUser = (val: any): val is IUser =>
  isObject(val) &&
  'displayName' in val &&
  'login' in val &&
  'settings' in val
