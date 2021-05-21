import { intArray, stringValue } from '../utils/env'


export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Unknown = 'Unknown',
}


export enum UserLevel {
  guest = 'guest',
  level1 = 'level1',
  level2 = 'level2',
  level3 = 'level3',
  moderator = 'moderator',
  admin = 'admin',
  advertiser = 'advertiser',
  banned = 'banned',
}

const _level1 = intArray(process.env.USER_LEVEL_1, [0])
const _level2 = intArray(process.env.USER_LEVEL_2, [])
const _level3 = intArray(process.env.USER_LEVEL_3, [])

export const userLevelsGroupIds = {
  [UserLevel.guest]: intArray(process.env.USER_LEVEL_GUEST, [-1]),
  [UserLevel.level1]: _level1,
  [UserLevel.level2]: [..._level1, ..._level2],
  [UserLevel.level3]: [..._level1, ..._level2, ..._level3],
  [UserLevel.advertiser]: intArray(process.env.USER_LEVEL_ADVERTISER, []),
  [UserLevel.moderator]: intArray(process.env.USER_LEVEL_MOD, [2]),
  [UserLevel.admin]: intArray(process.env.USER_LEVEL_ADMIN, [1]),
  [UserLevel.banned]: intArray(process.env.USER_LEVEL_BANNED, []),
}
