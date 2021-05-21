import { defineRoute, param } from 'type-route'
import { slugWithIdSerializer } from './routing/serializers/slug-with-id.serializer'
import { IBoardEx, IBoardExMin, ITopicEx } from '../common/forum/forum.ex.interfaces'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import { ICategory } from '../common/forum/forum.base.interfaces'


const resolve = (...route: string[]) => route.length > 0 ? `/${route.join('/')}`.replace('//', '/') : ''


export const definedRoutes = {
  boardList: defineRoute('/'),
  login: defineRoute('/login'),
  registration: defineRoute('/registration'),
  forgotPassword: defineRoute('/forgot-password'),
  lastMessages: defineRoute(
    {
      page: param.path.optional.number,
    },
    p => resolve('/last-messages', p.page)
  ),
  users: defineRoute(
    {
      page: param.path.optional.number,
    },
    p => resolve('/users', p.page)
  ),
  user: defineRoute(
    {
      user: param.path.ofType(slugWithIdSerializer),
    },
    p => resolve('/user', p.user)
  ),
  profile: defineRoute('/profile'),
  settings: defineRoute('/settings'),
  boardTopicList: defineRoute(
    {
      board: param.path.ofType(slugWithIdSerializer),
      page: param.path.optional.number,
    },
    p => resolve('/board', p.board, p.page),
  ),
  topicMessageList: defineRoute(
    {
      topic: param.path.ofType(slugWithIdSerializer),
      page: param.path.optional.number,
    },
    p => resolve('/topic', p.topic, p.page),
  ),
}

export const modalRoutes: Array<keyof typeof definedRoutes> = [
  'login',
  'registration',
  'forgotPassword',
]

export type RouteDataTypes = {
  boardList: {
    boards: IBoardEx[]
  }
  boardTopicList: {
    page: number
    board: IBoardExMin
    pageData: { items: ITopicEx[]; meta: IPaginationMeta }
    pageMeta: Omit<IPaginationMeta, 'currentPage'>
  }
}


