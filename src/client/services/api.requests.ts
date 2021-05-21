import { MessageRelationsArray, TopicRelationsArray } from '../../common/forum/forum.entity-relations'

export interface LoginRequest {
  username: string
  password: string
}

interface BasePagesRequest {
  pageSize?: number
  page?: number
}

export interface MessageLatestRequest extends BasePagesRequest {
  // relations?: MessageRelationsArray
}

export interface MessageByTopicRequest extends BasePagesRequest {
  topic: number
  // relations?: MessageRelationsArray
}

export interface MessageByUserRequest extends BasePagesRequest {
  user: number
  // relations?: MessageRelationsArray
}


export interface TopicLatestRequest extends BasePagesRequest{
  // relations?: TopicRelationsArray
}

export interface TopicByBoardRequest extends BasePagesRequest{
  board: number,
  // relations?: TopicRelationsArray
}

export interface TopicByUserRequest extends BasePagesRequest{
  user: number,
  // relations?: TopicRelationsArray
}
