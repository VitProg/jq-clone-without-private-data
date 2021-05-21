import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { IBoard, IMessage, ITopic, IUser } from '../forum/forum.base.interfaces'
import { BoardRelationsRecord, MessageRelationsRecord, TopicRelationsRecord } from '../forum/forum.entity-relations'
import { IBoardEx, IMessageEx, ITopicEx } from '../forum/forum.ex.interfaces'


export type IForumMessageManyResponse = Pagination<IMessageEx>// & { relations?: MessageRelationsRecord }
export type IForumTopicManyResponse = Pagination<ITopicEx>// & { relations?: TopicRelationsRecord }
// export type IForumBoardManyResponse = { items: IBoard[], relations?: BoardRelationsRecord }
export type IForumBoardManyResponse = Array<IBoardEx>
export type IForumUserManyResponse = Pagination<IUser>

export type IActiveUsersResponse = Pagination<IUser>

export type IProfileResponse = IUser

export interface IForumBoardDynamicData {
  id: number
  lastMessage: IMessage | undefined
  lastTopic: ITopic | undefined
  lastUser: IUser | undefined
  topics: number
  messages: number
}

export type IForumBoardDynamicDataResponse = Array<IForumBoardDynamicData>
