import {
  RedisBoardFullHash,
  RedisBoardHash,
  RedisMessageHash,
  RedisTopicFullHash,
  RedisTopicHash,
  RedisUserHash
} from './redis'
import { IBoardEx, IMessageEx, ITopicEx, IUserEx } from '../../../common/forum/forum.ex.interfaces'
import { splitPipedNumbers } from '../../../common/utils/string'
import { timestampToDate, toGender } from './transform'
import { getUserLevelByGroups } from '../../../common/forum/utils'
import { IMessage } from '../../../common/forum/forum.base.interfaces'
import { has } from 'mobx'


export const toBoardEx = (hash: RedisBoardHash | RedisBoardFullHash, withGroups = true, messagePage?: number): IBoardEx => ({
  id: hash.id,
  name: hash.name,
  url: hash.url,
  description: hash.desc,
  ...(withGroups ? { groups: splitPipedNumbers(hash.groups) } : {}),
  level: hash.level,
  parentId: hash.parent,
  category: {
    id: hash.cat,
    name: hash.cat_name,
  },
  last: {
    topic: 'lt_id' in hash && hash.lt_id > 0 ? {
      id: hash.lt_id,
      subject: hash.lt_subject,
      url: hash.lt_url,
    } : undefined,
    message: 'lm_id' in hash && hash.lm_id > 0 ? {
      id: hash.lm_id,
      date: timestampToDate(hash.lm_date),
    } : undefined,
    user: 'lu_id' in hash && hash.lu_id > 0 ? {
      id: hash.lu_id,
      name: hash.lu_name,
      url: hash.lu_url,
    } : undefined,
    messagePage,
  },
  ...('nt' in hash && 'nm' in hash ?
      {
        counters: {
          topic: hash.nt,
          message: hash.nm,
        }
      } : {}
  )
})

export const toTopicEx = (hash: RedisTopicHash | RedisTopicFullHash, messagePage?: number): ITopicEx => ({
  id: hash.id,
  url: hash.url,
  subject: hash.subject,
  boardId: hash.board,
  flags: {
    isApproved: !!hash.approved,
    isPinned: !!hash.pinned,
    isPinnedFirstMessage: !!hash.pinned_fm,
  },
  first: {
    message: hash.fm_id > 0 ? {
      id: hash.fm_id,
      date: timestampToDate(hash.date),
    } : undefined,
    user: hash.au_id > 0 ? {
      id: hash.au_id,
      name: hash.au_name,
      url: hash.au_url,
    } : undefined,
  },
  last: {
    message: 'lm_id' in hash && hash.lm_id > 0 ? {
      id: hash.lm_id,
      date: timestampToDate(hash.lm_date),
    } : undefined,
    user: 'lu_id' in hash && hash.lu_id > 0 ? {
      id: hash.lu_id,
      name: hash.lu_name,
      url: hash.lu_url,
    } : undefined,
    messagePage,
  },
  ...('nm' in hash ?
      {
        counters: {
          message: hash.nm,
        }
      } :
      {}
  )
})

export const toMessageEx = (hash: RedisMessageHash, ex?: {
  fullMessage?: Pick<IMessage, 'dates' | 'body'>
  board?: IBoardEx
  topic?: ITopicEx
  user?: IUserEx
}): IMessageEx => ({
  id: hash.id,
  date: ex?.fullMessage?.dates.createdAt ?? timestampToDate(hash.date),
  editDate: ex?.fullMessage?.dates.updatedAt,
  board: ex?.board ?? hash.board,
  topic: ex?.topic ?? hash.topic,
  user: ex?.user ?? hash.user,
  body: ex?.fullMessage?.body,
  flags: {
    isApproved: !!hash.approved,
  },
  rate: {
    plus: hash.rate_m,
    minus: hash.rate_m,
  },
})

export const toUserEx = (hash: RedisUserHash): IUserEx => ({
  id: hash.id,
  name: hash.name,
  url: hash.url,
  avatar: hash.avatar,
  dates: {
    lastLogin: timestampToDate(hash.l_date),
    registration: timestampToDate(hash.r_date),
  },
  counters: {
    message: hash.nm,
    topic: hash.nt,
  },
  flags: {
    isActivated: !!hash.activated,
  },
  karma: {
    minus: hash.karma_m,
    plus: hash.karma_p,
  },
  lastSeen: {
    messageId: hash.ls_global,
  },
  settings: {
    groups: splitPipedNumbers(hash.groups),
    level: hash.level ?? getUserLevelByGroups(splitPipedNumbers(hash.groups)),
    gender: toGender(hash.gender),
  },
})
