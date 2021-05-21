import { IUser as IUser, IUserGroup } from '../forum.base.interfaces'
import { Gender, UserLevel } from '../forum.constants'
import slug from 'slug'
import { getUserName, getUserSlug } from '../utils'


export class User implements IUser {
  id: number = 0
  email?: string
  login: string = ''
  displayName: string = ''
  url: string = ''
  avatar: string = ''
  gender: Gender = Gender.Unknown
  level: UserLevel = UserLevel.level1
  dates: {
    lastLogin?: Date
    registered?: Date
  } = {}
  statistics: {
    posts: number
    karmaPlus: number
    karmaMinus: number
  } = {
    karmaMinus: 0,
    karmaPlus: 0,
    posts: 0,
  }
  settings: {
    timeOffset: number
    permissions?: string[]
    groupIds: number[]
    groups?: IUserGroup[]
  } = {
    timeOffset: 0,
    groupIds: [-1, 0],
  }
  auth?: {
    passwordHash?: string
    salt?: string
  }
  flags: {
    isActivated: boolean
  } = {
    isActivated: false
  }

  get name () {
    return getUserName(this)
  }

  get slug () {
    return getUserSlug(this)
  }
}
