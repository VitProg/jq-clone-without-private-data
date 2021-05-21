import { Gender, UserLevel } from './forum.constants'
import { MemberEntity } from '../../server/entities'
import { AnyObject } from '../utils/types'


export interface IUser {
  id: number
  email?: string
  login: string
  displayName: string
  url: string
  avatar: string
  gender: Gender
  level: UserLevel
  dates: {
    lastLogin?: Date
    registered?: Date
  }
  statistics: {
    posts: number
    karmaPlus: number
    karmaMinus: number
  }
  flags: {
    isActivated: boolean
  }
  settings: {
    timeOffset: number
    permissions?: string[]
    groupIds: number[]
    groups?: IUserGroup[]
  }
  auth?: {
    passwordHash?: string
    salt?: string
  },
  __raw?: MemberEntity & AnyObject,
}

export interface IMessage {
  id: number
  body: string
  dates: {
    createdAt?: Date
    updatedAt?: Date
  }
  flags: {
    isApproved?: boolean
  }
  linksId: {
    user: number
    topic: number
    board: number
  }
  statistics: {
    ratePlus: number
    rateMinus: number
  }
}

export interface IBoard {
  id: number
  url: string
  name: string
  description: string
  notice?: string
  onlyIndexNotice?: string
  settings: {
    forGroups?: number[]
    onlyIndexGroups?: number[]
    order: number
    level: number
    hidden: boolean
  }
  linksId: {
    parent: number
    category: number
    lastTopic?: number
    lastMessage?: number
    lastUser?: number
  }
  counters?: {
    topics: number
    messages: number
  }
}

export interface ICategory {
  id: number
  name: string
  settings: {
    order: number
  }
}

export interface ITopic {
  id: number
  url: string
  subject: string
  flags: {
    isLocked: boolean
    isSticky: boolean
    isApproved: boolean
    isStickyFirstPost: boolean
  }
  linksId: {
    poll?: number
    board: number
    firstMessage: number
    lastMessage: number
  }
  counters?: {
    messages: number
  }
}

export interface IPermission {
  groupId: number
  name: string
}

export interface IUserGroup {
  id: number
  name: string
  minPosts?: number
  maxMessages?: number
  color?: string
}

