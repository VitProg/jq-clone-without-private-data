import { ITopicPrepareService, ITopicService } from '../types'
import { resolve } from '../../../ioc/ioc.utils'
import { IApiService } from '../../types'
import { ApiServiceSymbol, BoardPrepareServiceSymbol, TopicServiceSymbol } from '../../ioc.symbols'
import { store } from '../../../store'
import { DataStorePagesGetPageData, RequestStatus, TopicDataPageProps } from '../../../store/forum/types'
import { action, makeObservable, runInAction } from 'mobx'
import { StoredRoute } from '../../../store/types'
import { isRoute } from '../../../routing/utils'
import { mute } from '../../../../common/utils/promise'
import { ITopic } from '../../../../common/forum/forum.base.interfaces'
import { isArray } from '../../../../common/type-guards'
import { GetRoute } from '../../../routing/types'
import { omit } from '../../../../common/utils/object'
import { ITopicEx } from '../../../../common/forum/forum.ex.interfaces'
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { BoardPrepareService } from '../board/board-prepare.service'
import { RouteDataTypes } from '../../../routes'


export class TopicPrepareService implements ITopicPrepareService {
  private readonly topicService = resolve<ITopicService>(TopicServiceSymbol)
  private readonly boardPrepareService = resolve<BoardPrepareService>(BoardPrepareServiceSymbol)
  private readonly api = resolve<IApiService>(ApiServiceSymbol)

  constructor () {
    makeObservable(this)
  }

  processRoute (route: StoredRoute): boolean {
    if (isRoute(route, 'boardTopicList')) {
      mute(this.boardTopicList(route))

      return true
    }

    return false
  }

  @action
  async boardTopicList (route: GetRoute<'boardTopicList'>) {
    const pageProps: DataStorePagesGetPageData<TopicDataPageProps> = {
      type: 'board' as const,
      board: route.params.board.id,
      page: route.params.page ?? 1,
    }

    const status = this.getStatus(route, pageProps)
    if (status) {
      return
    }

    const boardId = route.params.board.id
    const pageSize = store.configStore.forumTopicPageSize

    try {
      const status = this.getStatus(route, pageProps)
      this.setStatus(route, pageProps, 'pending')

      console.log('Prepare data for', pageProps)

      await this.boardPrepareService().prepareAll()
      const data = await this.load(pageProps, pageSize)

      const board = await this.boardPrepareService().prepareAndGet(boardId)

      if (data && board) {
        this.setStatus(route, pageProps, 'loaded', {
          loadResult: data,
          routeDataEx: { board },
        })
      } else {
        this.setStatus(route, pageProps, 'error')
      }
    } catch {
      this.setStatus(route, pageProps, 'error')
    }
  }

  private getStatus = (route: GetRoute<'boardTopicList'>,
    pageProps: { page: number } & Omit<TopicDataPageProps, 'meta'>) => runInAction(() => {
    const status = store.forumStore.topicStore.getStatus('getPage', pageProps,)
    const storedPageProps = store.routeDataStore.get(route)

    if ((storedPageProps && status !== storedPageProps.status) ||
      (status === 'loaded' && (!storedPageProps?.data?.pageData.items?.length || !storedPageProps?.data?.pageData.items[0]))
    ) {
      store.forumStore.topicStore.setStatus('getPage', pageProps, undefined)
      store.routeDataStore.remove(route)
      return undefined
    }

    return status
  })

  private setStatus = (
    route: GetRoute<'boardTopicList'>,
    pageProps: DataStorePagesGetPageData<TopicDataPageProps>,
    status: RequestStatus,
    data?: {
      loadResult: Pagination<ITopicEx> | undefined,
      routeDataEx: Omit<RouteDataTypes['boardTopicList'], 'page' | 'pageData' | 'pageMeta'>,
    },
  ) => runInAction(() => {
    store.forumStore.topicStore.setStatus('getPage', pageProps, status)

    if (data && data.loadResult) {
      const pageMeta = store.forumStore.topicStore.getPageMeta({
        ...omit(pageProps, 'page'),
      })

      store.forumStore.topicStore.setPage({
        items: data.loadResult.items,
        pageProps: {
          ...omit(pageProps, 'page'),
          meta: data.loadResult.meta,
        }
      })

      store.routeDataStore.setPageProps(route, {
        status,
        ...route.params,
        data: {
          page: data.loadResult.meta.currentPage,
          pageData: data.loadResult,
          pageMeta: pageMeta ?? {
            ...omit(data.loadResult.meta, 'currentPage'),
          },
          ...data.routeDataEx,
        },
      })
    } else {
      store.routeDataStore.setPageProps(route, {
        status: status === 'loaded' ? 'error' : status,
        ...route.params,
      })
    }
  })

  @action
  async prepareAndGet<N extends number | number[]> (id: N): Promise<(N extends number ? ITopic : ITopic[]) | undefined> {
    const isSingle = !isArray(id)
    const ids = (isArray(id) ? id : [id]).sort() as number[]


    const fromStore = store.forumStore.topicStore.getMany(ids, false)

    if (fromStore && fromStore.length > 0) {
      return (isSingle ? fromStore[0] : fromStore) as any
    }

    try {
      store.forumStore.topicStore.setStatus('getMany', ids, 'pending')

      const items = await this.topicService().byIds(ids)

      return runInAction(() => {
        if (!items) {
          store.forumStore.topicStore.setStatus('getMany', ids, undefined)
          return
        }

        store.forumStore.topicStore.setMany({ items })

        store.forumStore.topicStore.setStatus('getMany', ids, 'loaded')

        return (isSingle ? items[0] : items) as any
      })
    } catch {
      runInAction(() => {
        store.forumStore.topicStore.setStatus('getMany', ids, 'error')
      })
    }
  }


  private async load (pageProps: { page: number } & Omit<TopicDataPageProps, 'meta'>, pageSize: number) {
    switch (pageProps.type) {
      case 'board':
        if (!pageProps.board) {
          throw new Error('TopicPrepareService: board is empty')
        }

        return this.topicService().byBoard({
          page: pageProps.page,
          board: pageProps.board,
        })
      case 'user':
      // todo
      // if (!pageProps.user) {
      //   throw new Error('TopicPrepareService: user is empty')
      // }
      //
      // /// todo add UserPrepareService
      //
      // return this.topicService.byUser({
      //   page: pageProps.page,
      //   user: pageProps.user,
      //   pageSize: store.configStore.forumTopicPageSize,
      // })
    }
  }

}
