import { Gender, UserLevel } from './forum.constants'
import { ICategoryPartEx, IMessagePartEx, ITopicPartEx, IUserPartEx } from './forum.part-ex.interfaces'
import { DialogContentText } from '@material-ui/core'


export type IUserEx = {
  id: number
  name: string
  url: string
  avatar: string
  dates: {
    lastLogin?: Date
    registration?: Date
  }
  settings: {
    groups: number[]
    level: UserLevel
    gender: Gender
  }
  counters: {
    topic: number
    message: number
  }
  karma: {
    plus: number
    minus: number
  }
  lastSeen: {
    messageId: number
  }
  flags: {
    isActivated: boolean
  }
}

export type IUserExMin = {
  id: number
  name: string
  url: string
  avatar?: string
}

export type IMessageEx = {
  id: number
  date: Date
  editDate?: Date
  board: IBoardEx | number
  topic: ITopicEx | number
  user: IUserEx | number
  body?: string
  flags: {
    isApproved: boolean
  }
  rate: {
    plus: number
    minus: number
  }
}



export type IBoardEx = {
  id: number
  url: string
  name: string
  description: string
  groups?: number[]
  level: number
  parentId: number
  category: ICategoryPartEx
  counters?: {
    topic: number
    message: number
  }
  last: {
    message?: IMessagePartEx
    user?: IUserPartEx
    topic?: ITopicPartEx
    messagePage?: number
  }
}

export type IBoardExMin = Omit<IBoardEx, 'last' | 'counters'>

export type ITopicEx = {
  id: number
  subject: string
  url: string
  boardId: number
  flags: {
    isApproved: boolean
    isPinned: boolean
    isPinnedFirstMessage: boolean
  }
  first: {
    message?: IMessagePartEx
    user?: IUserPartEx
  }
  last: {
    message?: IMessagePartEx
    user?: IUserPartEx
    messagePage?: number
  }
  counters?: {
    message: number
  }
}
