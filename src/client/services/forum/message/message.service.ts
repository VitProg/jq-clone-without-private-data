import { makeAutoObservable } from 'mobx'
import { IMessageService } from '../types'
import { inject, resolve } from '../../../ioc/ioc.utils'
import { IApiService } from '../../types'
import { IForumMessageManyResponse } from '../../../../common/responses/forum.responses'
import { ApiServiceSymbol } from '../../ioc.symbols'
import { MessageByTopicRequest, MessageByUserRequest, MessageLatestRequest } from '../../api.requests'
import { MessageRelations, MessageRelationsArray } from '../../../../common/forum/forum.entity-relations'
import { uniqueArray } from '../../../../common/utils/array'
import { IMessageEx } from '../../../../common/forum/forum.ex.interfaces'


const LATEST_MAX_PAGES = 10
const DEFAULT_LATEST_PAGE_SIZE = 10
const DEFAULT_WITH_RELATIONS: MessageRelationsArray = [MessageRelations.user, MessageRelations.topic]


export class MessageService implements IMessageService {
  private readonly api = resolve<IApiService>(ApiServiceSymbol)

  constructor () {
    makeAutoObservable(this)
  }

  latest (request: MessageLatestRequest) {
    const searchParams: typeof request = {
      pageSize: DEFAULT_LATEST_PAGE_SIZE,
      // relations: DEFAULT_WITH_RELATIONS,
      ...request
    }

    return this.api()
      .get<IForumMessageManyResponse>(
        'message/latest',
        {
          searchParams,
          reformat: (data) => {
            data.meta.currentPage = data.meta.currentPage >>> 0
            data.meta.totalItems = Math.min(LATEST_MAX_PAGES * data.meta.itemsPerPage, data.meta.totalItems)
            data.meta.totalPages = Math.min(LATEST_MAX_PAGES, data.meta.totalPages)
          },
        })
  }

  byTopic (request: MessageByTopicRequest) {
    const { topic, ...forRequest } = request

    const searchParams: typeof forRequest= {
      pageSize: DEFAULT_LATEST_PAGE_SIZE,
      // relations: DEFAULT_WITH_RELATIONS,
      ...forRequest
    }

    return this.api()
      .get<IForumMessageManyResponse>(
        `message/topic/${topic}`,
        {
          searchParams,
        })
  }

  byUser (request: MessageByUserRequest) {
    const { user, ...forRequest } = request

    const searchParams: typeof forRequest = {
      pageSize: DEFAULT_LATEST_PAGE_SIZE,
      // relations: DEFAULT_WITH_RELATIONS,
      ...forRequest
    }

    return this.api()
      .get<IForumMessageManyResponse>(
        `message/user/${user}`,
        {
          searchParams,
        })
  }

  async byId (id: number) {
    try {
      return await this.api()
        .get<IMessageEx | undefined>(`message/${id}`)
    } catch {
      return undefined
    }
  }

  async byIds (ids: number[]) {
    if (ids.length === 0) {
      return [] as IMessageEx[]
    }

    if (ids.length === 1) {
      const item = await this.byId(ids[0])
      return item ? [item] : []
    }

    try {
      const items = await this.api()
        .get<IMessageEx[]>(`message/many/${uniqueArray(ids).join('|')}`)
      return items ?? []
    } catch {
      return [] as IMessageEx[]
    }
  }


}
