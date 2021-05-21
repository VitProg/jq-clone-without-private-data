import { IForumService, IMessagePrepareService, IMessageService, ITopicPrepareService } from './types'
import { inject, resolve } from '../../ioc/ioc.utils'
import {
  BoardPrepareServiceSymbol,
  CategoryPrepareServiceSymbol,
  MessagePrepareServiceSymbol,
  MessageServiceSymbol, TopicPrepareServiceSymbol, UserPrepareServiceSymbol
} from '../ioc.symbols'
import { store } from '../../store'
import { action, makeAutoObservable, makeObservable, reaction } from 'mobx'
import { BoardPrepareService } from './board/board-prepare.service'
import { CategoryPrepareService } from './category/category-prepare.service'
import { UserPrepareService } from './user/user-prepare.service'


export class ForumService implements IForumService {
  private readonly messageService = resolve<IMessageService>(MessageServiceSymbol)
  private readonly messagePrepareService = resolve<IMessagePrepareService>(MessagePrepareServiceSymbol)
  private readonly topicPrepareService = resolve<ITopicPrepareService>(TopicPrepareServiceSymbol)
  private readonly boardPrepareService = resolve<BoardPrepareService>(BoardPrepareServiceSymbol)
  private readonly categoryPrepareService = resolve<CategoryPrepareService>(CategoryPrepareServiceSymbol)
  private readonly userPrepareService = resolve<UserPrepareService>(UserPrepareServiceSymbol)

  private preparing = false

  @action.bound
  async prepare (): Promise<void> {
    if (!this.preparing) {
      this.preparing = true
      await this.boardPrepareService().prepareAll()
      await this.categoryPrepareService().prepareAll()
      this.preparing = false
    }
  }

  //todo add other services


  constructor () {
    makeObservable(this)

    let lastIsAuth: boolean | undefined

    reaction(
      () => [
        store.routeStore.noModalRoute,
        store.myStore.isAuth,
      ],
      async (current: any[], last: any[]) => {
        if (current?.[0]?.href === last?.[0]?.href && current?.[1] === last?.[1]) {
          return
        }

        const auth = store.myStore.isAuth
        if (lastIsAuth !== undefined && auth !== lastIsAuth) {
          //clear all cache
          store.forumStore.clearAll()
          await this.prepare()
        }

        lastIsAuth = auth

        const route = store.routeStore.noModalRoute ?? store.routeStore.current

        this.boardPrepareService().processRoute(route)
        this.topicPrepareService().processRoute(route)
        this.messagePrepareService().processRoute(route)
        this.userPrepareService().processRoute(route)

      }, {
        fireImmediately: true
      })

    setTimeout(() => this.prepare())
  }
}
