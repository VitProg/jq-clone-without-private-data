import { isArray, isNumber, isObject } from '../../../common/type-guards'
import { Gender, UserLevel } from '../../../common/forum/forum.constants'
import { toInt } from '../../../common/utils/number'

const btoa = (str: string | Buffer) => {
  let buffer: any;

  if (str instanceof Buffer) {
    buffer = str;
  } else {
    buffer = Buffer.from(str.toString(), 'binary');
  }

  return buffer.toString('base64');
}

export const getKeyBoardOrderedLevel = (level: string) => `s:board:${level}`
export const getKeyBoardLastTopicLevel = (level: string) => `s:board-last-topic:${level}`
export const getKeyBoardLastMessageLevel = (level: string) => `s:board-last-mess:${level}`
export const getKeyBoardNumMessagesLevel = (level: string) => `s:board-num-mess:${level}`
export const getKeyBoardNumTopicsLevel = (level: string) => `s:board-num-topics:${level}`
export const getKeyBoardHash = (boardId: number) => `h:board:${boardId}`
export const getKeyBoardStatHash = (boardId: number, level: string) => `h:board-stat:${level}:${boardId}`
export const boardKeyPrefixes = ['s:board', 'h:board']
export const boardNumsKeyPrefixes = ['s:board-num-mess:', 's:board-num-topics:']

export type RedisBoardHash = {
  id: number
  name: string
  url: string
  desc: string
  groups: string
  level: number
  parent: number
  cat: number
  cat_name: string
}

export type RedisBoardStatHash = {
  id: number
  lt_id: number
  lt_subject: string
  lt_url: string
  lm_id: number
  lm_date: number
  lu_id: number
  lu_name: string
  lu_url: string
  nt: number
  nm: number
}

export type RedisBoardFullHash = RedisBoardHash & Omit<RedisBoardStatHash, 'id'>

export const toRedisBoardHash = (data: Record<string, string>): RedisBoardHash => {
  return {
    id: toInt(data.id),
    name: data.name,
    url: data.url,
    desc: data.desc,
    groups: data.groups,
    level: toInt(data.level),
    parent: toInt(data.parent),
    cat: toInt(data.cat),
    cat_name: data.cat_name,
  }
}
export const toRedisBoardHashRequired = (data: Record<string, string>): RedisBoardHash | undefined => {
  return toInt(data.id) ? toRedisBoardHash(data) : undefined
}


export const toRedisBoardStatHash = (data: Record<string, string>): RedisBoardStatHash => {
  return {
    id: toInt(data.id),
    lt_id: toInt(data.lt_id),
    lt_subject: data.lt_subject,
    lt_url: data.lt_url,
    lm_id: toInt(data.lm_id),
    lm_date: toInt(data.lm_date),
    lu_id: toInt(data.lu_id),
    lu_name: data.lu_name,
    lu_url: data.lu_url,
    nt: toInt(data.nt),
    nm: toInt(data.nm),
  }
}
export const toRedisBoardStatHashRequired = (data: Record<string, string>): RedisBoardStatHash | undefined => {
  return toInt(data.id) ? toRedisBoardStatHash(data) : undefined
}



export const getKeyTopicBoardLevel = (boardId: number, level: string) => `s:topic:board:${boardId}:${level}`
export const getKeyTopicBoardNumMessagesLevel = (boardId: number, level: string) => `s:topic-num-mess:board:${boardId}:${level}`
export const getKeyTopicLatestLevel = (level: string) => `s:topic-latest:${level}`
export const getKeyTopicNumMessagesLevel = (level: string) => `s:topic-num-mess:${level}`
export const getKeyTopicHash = (topicId: number) => `h:topic:${topicId}`
export const getKeyTopicStatHash = (topicId: number, level: string) => `h:topic-stat:${level}:${topicId}`
export const topicKeyPrefixes = ['s:topic', 'h:topic']
export const topicNumsKeyPrefixes = ['s:topic-num-mess:']

export const PINNED_POST_FACTOR = Math.ceil(Number.MAX_SAFE_INTEGER / 2)

export type RedisTopicHash = {
  id: number
  subject: string
  url: string
  approved: number
  pinned: number
  pinned_fm: number
  date: number
  board: number
  fm_id: number
  au_id: number
  au_name: string
  au_url: string
}
export type RedisTopicHash_OnlyAuthor = Pick<RedisTopicHash, 'au_id' | 'au_name' | 'au_url' | 'date'>

export type RedisTopicStatHash = {
  id: number
  lm_id: number
  lm_date: number
  lu_id: number
  lu_name: string
  lu_url: string
  nm: number
}

export type RedisTopicFullHash = RedisTopicHash & Omit<RedisTopicStatHash, 'id'>

export const toRedisTopicHash = (data: Record<string, string>): RedisTopicHash => {
  return {
    id: toInt(data.id),
    subject: data.subject,
    url: data.url,
    approved: toInt(data.approved),
    pinned: toInt(data.pinned),
    pinned_fm: toInt(data.pinned_fm),
    date: toInt(data.date),
    board: toInt(data.board),
    fm_id: toInt(data.fm_id),
    au_id: toInt(data.au_id),
    au_name: data.au_name,
    au_url: data.au_url,
  }
}
export const toRedisTopicHashRequired = (data: Record<string, string>): RedisTopicHash | undefined => {
  return toInt(data.id) ? toRedisTopicHash(data) : undefined
}

export const toRedisTopicStatHash = (data: Record<string, string>): RedisTopicStatHash => {
  return {
    id: toInt(data.id),
    lm_id: toInt(data.lm_id),
    lm_date: toInt(data.lm_date),
    lu_id: toInt(data.lu_id),
    lu_name: data.lu_name,
    lu_url: data.lu_url,
    nm: toInt(data.nm),
  }
}
export const toRedisTopicStatHashRequired = (data: Record<string, string>): RedisTopicStatHash | undefined => {
  return toInt(data.id) ? toRedisTopicStatHash(data) : undefined
}


export const getKeyMessageBoardLevel = (boardId: number, level: string) => `s:message:board:${boardId}:${level}`
export const getKeyMessageTopicLevel = (topicId: number, level: string) => `s:message:topic:${topicId}:${level}`
export const getKeyMessageLatestLevel = (level: string) => `s:message-latest:${level}`
export const getKeyMessageBoardLatestLevel = (boardId: number, level: string) => `s:message-latest:board:${boardId}:${level}`
// export const getKeyMessageToTopic = (messageId: number) => `kv:message:${messageId}:topic`
export const getKeyMessageHash = (messageId: number) => `h:message:${messageId}`
export const messageKeyPrefixes = ['s:message', 'h:message', 'kv:message']

export type RedisMessageHash = {
  id: number
  topic: number
  board: number
  date: number
  user: number
  approved: number
  rate_p: number
  rate_m: number
  //todo
}

export const toRedisMessageHash = (data: Record<string, string>): RedisMessageHash => {
  return {
    id: toInt(data.id),
    topic: toInt(data.topic),
    board: toInt(data.board),
    date: toInt(data.date),
    user: toInt(data.user),
    approved: toInt(data.approved) === 1 ? 1 : 0,
    rate_p: toInt(data.rate_p),
    rate_m: toInt(data.rate_m),
  }
}

///// USER /////

export const getKeyUserHash = (userId: number) => `h:user:${userId}`
export const getKeyUserLastSeenBoard = (userId: number, boardId: number) => `h:user-last-seen:${userId}:board:${boardId}`
export const getKeyUserLastSeenTopic = (userId: number, topicId: number) => `h:user-last-seen:${userId}:topic:${topicId}`
// export const getKeyUserNameToId = (userName: string) => `kv:user-name:${userName.toLowerCase()}`
export const getKeyUserHashNameToId = () => `h:user-name`
export const userKeyPrefixes = ['h:user', 'kv:user-name:', 'h:user-name']

export type RedisUserHash = {
  id: number
  name: string
  url: string
  avatar: string
  l_date: number
  r_date: number
  groups: string
  level: UserLevel
  gender: 'm' | 'f' | '',
  nt: number
  nm: number
  karma_p: number
  karma_m: number
  ls_global: number
  activated: number
}


export const toRedisUserHash = (data: Record<string, string>): RedisUserHash | undefined => {
  const id = toInt(data.id)
  if (!id) {
    return undefined
  }
  return {
    id,
    name: data.name,
    url: data.url,
    avatar: data.avatar,
    l_date: toInt(data.l_date),
    r_date: toInt(data.r_date),
    groups: data.groups,
    level: data.level as UserLevel,
    gender: data.gender === 'f' ? 'f' : (data.gender === 'm' ? 'm' : ''),
    nt: toInt(data.np),
    nm: toInt(data.nm),
    karma_p: toInt(data.karma_p),
    karma_m: toInt(data.karma_m),
    ls_global: toInt(data.ls_global),
    activated: 0,
  }
}

/////////////////////


export const zResultWithScoresToMap = (result: string[], filterByKey?: number[]): Map<number, number> => {
  let map: Map<number, number> = new Map()
  for (let index = 0; index <= result.length; index+=2) {
    const key = toInt(result[index])
    const val = toInt(result[index + 1])
    if (isNumber(key) && (!filterByKey || filterByKey.includes(key))) {
      const v = isNumber(val) ? val : 0
      map.set(key, Math.abs(v))
    }
  }
  return map
}

export const zResultToArray = (result: string[], filterByKey?: number[]): number[] => {
  return result
    .map(i => toInt(i))
    .filter(i => !filterByKey || filterByKey.includes(i))
}

export const zResultWithScoresToSum = (result: string[], filterByKey?: number[]): number => {
  let sum = 0
  for (let index = 0; index <= result.length; index+=2) {
    const key = toInt(result[index])
    const val = toInt(result[index + 1])
    if (isNumber(val) && (!filterByKey || filterByKey.includes(key))) {
      sum += Math.abs(val)
    }
  }
  return sum
}

export const encodeRedisValue = (val: any): string => {
  if (isObject(val)) {
    return 'O::' + JSON.stringify(val)
  }
  if (isArray(val)) {
    return 'A::' + JSON.stringify(val)
  }
  if (isNumber(val)) {
    return 'N::' + val.toString()
  }
  if (typeof val === 'boolean') {
    return 'B::' + (val ? '1' : '0')
  }
  return 'S::' + (val.toString())
}

export const decodeRedisValue = <T = any>(val: string): T => {
  if (val.substr(1, 2) === '::') {
    const type = val.substr(0, 1)
    const encodedValue = val.substr(3)

    if (type === 'O' || type === 'A') {
      try {
        return JSON.parse(encodedValue)
      } catch {
        return undefined as any
      }
    }

    if (type === 'N') {
      return (val.includes('.') ? parseFloat(val) : toInt(val)) as any
    }

    if (type === 'B') {
      return (val === '1') as any
    }

    return val as any
  }
  return val as any
}

export const objectToSetHashArray = (hash: Record<string, any>, encoded = false): string[] => {
  const result: string[] = []
  for (const [key, val] of Object.entries(hash)) {
    result.push(key.toString())
    result.push(encoded ? encodeRedisValue(val) : val.toString())
  }
  return result
}

