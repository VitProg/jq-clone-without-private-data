import { IBoard, ICategory, IMessage, ITopic, IUser } from './forum.base.interfaces'
import webpack from 'webpack'
import { ForumStoreType } from '../../client/store/forum/types'


export enum MessageRelations {
  board = 'board',
  topic = 'topic',
  user = 'user',
  category = 'category',
}

export type MessageRelationsArray = Array<MessageRelations>
export type MessageRelationsRecord = {
  [MessageRelations.topic]?: Record<number, ITopic>,
  [MessageRelations.board]?: Record<number, IBoard>,
  [MessageRelations.user]?: Record<number, IUser>,
  [MessageRelations.category]?: Record<number, ICategory>,
}
export type MessageRelationsSingle = {
  [MessageRelations.topic]?: ITopic,
  [MessageRelations.board]?: IBoard,
  [MessageRelations.user]?: IUser,
  [MessageRelations.category]?: ICategory,
}
export const MessageAllRelations = Object.values(MessageRelations)



export enum TopicRelations {
  board = 'board',
  category = 'category',
  lastMessage = 'lastMessage',
  lastUser = 'lastUser',
}

export type TopicRelationsArray = Array<TopicRelations>
export type TopicRelationsRecord = {
  [TopicRelations.board]?: Record<number, IBoard>,
  [TopicRelations.category]?: Record<number, ICategory>,
  [TopicRelations.lastMessage]?: Record<number, IMessage>,
  [TopicRelations.lastUser]?: Record<number, IUser>,
}
export type TopicRelationsSingle = {
  [TopicRelations.board]?: IBoard,
  [TopicRelations.category]?: ICategory,
  [TopicRelations.lastMessage]?: IMessage,
  [TopicRelations.lastUser]?: IUser,
}
export const TopicAllRelations = Object.values(TopicRelations)


export enum BoardRelations {
  category = 'category',
  lastTopic = 'lastTopic',
  lastMessage = 'lastMessage',
  lastUser = 'lastUser',
}

export type BoardRelationsArray = Array<BoardRelations>
export type BoardRelationsRecord = {
  [BoardRelations.category]?: Record<number, ICategory>,
  [BoardRelations.lastTopic]?: Record<number, ITopic>,
  [BoardRelations.lastMessage]?: Record<number, IMessage>,
  [BoardRelations.lastUser]?: Record<number, IUser>,
}
export type BoardRelationsSingle = {
  [BoardRelations.category]?: ICategory,
  [BoardRelations.lastTopic]?: ITopic,
  [BoardRelations.lastMessage]?: IMessage,
  [BoardRelations.lastUser]?: IUser,
}
export const BoarAllRelations = Object.values(BoardRelations)


export const AllRelationsMap = {
  ['message' as ForumStoreType]: MessageAllRelations,
  ['topic' as ForumStoreType]: TopicAllRelations,
  ['board' as ForumStoreType]: BoarAllRelations
}
