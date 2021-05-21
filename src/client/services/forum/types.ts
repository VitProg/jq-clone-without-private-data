import { IForumMessageManyResponse, IForumTopicManyResponse } from '../../../common/responses/forum.responses'
import { StoredRoute } from '../../store/types'

import { MessageDataPageProps, TopicDataPageProps } from '../../store/forum/types'
import {
  MessageByTopicRequest,
  MessageByUserRequest,
  MessageLatestRequest,
  TopicByBoardRequest,
  TopicByUserRequest,
  TopicLatestRequest
} from '../api.requests'
import { IMessage, ITopic } from '../../../common/forum/forum.base.interfaces'
import { IMessageEx, ITopicEx } from '../../../common/forum/forum.ex.interfaces'


export interface IForumService {
  prepare (): Promise<void>
}


export interface IMessageService {
  byId (id: number): Promise<IMessageEx | undefined>

  byIds (ids: number[]): Promise<IMessageEx[]>

  latest (request: MessageLatestRequest): Promise<IForumMessageManyResponse | undefined>

  byTopic (request: MessageByTopicRequest): Promise<IForumMessageManyResponse | undefined>

  byUser (request: MessageByUserRequest): Promise<IForumMessageManyResponse | undefined>
}

export interface IMessagePrepareService {
  processRoute (route?: StoredRoute): boolean

  preparePage (request: { page: number } & Omit<MessageDataPageProps, 'meta'>): Promise<void>

  prepareAndGet<N extends number | number[]> (id: N): Promise<(N extends number ? IMessage : IMessage[]) | undefined>
}

export interface ITopicService {
  byId (id: number): Promise<ITopicEx | undefined>

  byIds (ids: number[]): Promise<ITopicEx[]>

  latest (request: TopicLatestRequest): Promise<IForumTopicManyResponse | undefined>

  byBoard (request: TopicByBoardRequest): Promise<IForumTopicManyResponse | undefined>

  byUser (request: TopicByUserRequest): Promise<IForumTopicManyResponse | undefined>
}

export interface ITopicPrepareService {
  processRoute (route?: StoredRoute): boolean

  // preparePage (request: { page: number } & Omit<TopicDataPageProps, 'meta'>): Promise<void>

  prepareAndGet<N extends number | number[]> (id: N): Promise<(N extends number ? ITopic : ITopic[]) | undefined>
}
