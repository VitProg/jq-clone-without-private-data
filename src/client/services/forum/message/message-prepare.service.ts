import { IMessagePrepareService, IMessageService, ITopicPrepareService } from '../types'
import { resolve } from '../../../ioc/ioc.utils'
import { IApiService } from '../../types'
import { ApiServiceSymbol, MessageServiceSymbol, TopicPrepareServiceSymbol } from '../../ioc.symbols'
import { store } from '../../../store'
import { MessageDataPageProps } from '../../../store/forum/types'
import { runInAction } from 'mobx'
import { StoredRoute } from '../../../store/types'
import { isRoute } from '../../../routing/utils'
import { mute } from '../../../../common/utils/promise'
import { IMessage } from '../../../../common/forum/forum.base.interfaces'
import { container } from '../../../ioc/ioc.container'
import { isArray } from '../../../../common/type-guards'


export class MessagePrepareService implements IMessagePrepareService {
  private readonly messageService = resolve<IMessageService>(MessageServiceSymbol)
  private readonly api = resolve<IApiService>(ApiServiceSymbol)

  processRoute (route: StoredRoute): boolean {
    if (isRoute(route, 'lastMessages')) {
      const page = route.params.page ?? 1
      mute(this.preparePage({ type: 'latest', page }))

      if (page + 1 < store.configStore.forumMessageLatestMaxPages) {
        mute(this.preparePage({ type: 'latest', page: page + 1 }))
      }

      return true
    }

    if (isRoute(route, 'topicMessageList')) {
      const page = route.params.page ?? 1
      const topic = route.params.topic.id

      mute(this.preparePage({ type: 'topic', topic, page }))
      // mute(this.preparePage({ type: 'topic', topic,  page: page + 1 }))

      return true
    }

    //todo add other routes

    return false
  }


  async preparePage (pageProps: { page: number } & Omit<MessageDataPageProps, 'meta'>): Promise<void> {
    if (pageProps.type === 'search') {
      // todo
      return
    }

    const { page, ...props } = pageProps

    const status = store.forumStore.messageStore.getStatus('getPage', pageProps)
    if (status) {
      return
    }

    try {
      store.forumStore.messageStore.setStatus('getPage', pageProps, 'pending')

      console.log('Prepare data for', pageProps)

      const data = await this.load(pageProps)

      if (!data) {
        store.forumStore.messageStore.setStatus('getPage', pageProps, undefined)
        return
      }

      runInAction(() => {
        store.forumStore.messageStore.setPage({
          items: data.items,
          pageProps: {
            ...props,
            meta: data.meta,
          }
        })

        store.forumStore.messageStore.setStatus('getPage', pageProps, 'loaded')
      })
    } catch (e) {
      console.warn(e)
      runInAction(() => {
        store.forumStore.messageStore.setStatus('getPage', pageProps, 'error')
      })
    }
  }

  async prepareAndGet<N extends number | number[]> (id: N): Promise<(N extends number ? IMessage : IMessage[]) | undefined> {
    const isSingle = !isArray(id)
    const ids = (isArray(id) ? id : [id]).sort() as number[]


    const fromStore = store.forumStore.messageStore.getMany(ids, false)

    if (fromStore && fromStore.length > 0) {
      return (isSingle ? fromStore[0] : fromStore) as any
    }

    try {
      store.forumStore.messageStore.setStatus('getMany', ids, 'pending')

      const items = await this.messageService().byIds(ids)

      if (!items) {
        store.forumStore.messageStore.setStatus('getMany', ids, undefined)
        return
      }

      store.forumStore.messageStore.setMany({ items })

      store.forumStore.messageStore.setStatus('getMany', ids, 'loaded')

      return (isSingle ? items[0] : items) as any
    } catch {
      runInAction(() => {
        store.forumStore.messageStore.setStatus('getMany', ids, 'error')
      })
    }
  }


  private async load (pageProps: { page: number } & Omit<MessageDataPageProps, 'meta'>) {
    switch (pageProps.type) {
      case 'latest':
        return this.messageService().latest({
          page: pageProps.page,
          pageSize: store.configStore.forumMessagePageSize,
        })
      case 'topic':
        if (!pageProps.topic) {
          throw new Error('MessagePrepareService: topic is empty')
        }

        const topicPrepareService = container.get<ITopicPrepareService>(TopicPrepareServiceSymbol)
        const topic = await topicPrepareService.prepareAndGet(pageProps.topic)
        if (!topic) {
          throw new Error('MessagePrepareService: topic not found')
        }

        return this.messageService().byTopic({
          page: pageProps.page,
          topic: topic.id,
          pageSize: store.configStore.forumMessagePageSize,
        })
      case 'user':
        if (!pageProps.user) {
          throw new Error('MessagePrepareService: user is empty')
        }

        /// todo add UserPrepareService

        return this.messageService().byUser({
          page: pageProps.page,
          user: pageProps.user,
          pageSize: store.configStore.forumMessagePageSize,
        })
    }
  }


}
