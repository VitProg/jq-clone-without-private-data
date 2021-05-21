import { inject, resolve } from '../../../ioc/ioc.utils'
import { BoardService } from './board.service'
import { BoardServiceSymbol, CategoryPrepareServiceSymbol, UserPrepareServiceSymbol } from '../../ioc.symbols'
import { store } from '../../../store'
import { RouteDataItem, StoredRoute } from '../../../store/types'
import { isRoute } from '../../../routing/utils'
import { mute } from '../../../../common/utils/promise'
import { UserPrepareService } from '../user/user-prepare.service'
import { action, makeAutoObservable, makeObservable, reaction, runInAction, untracked, when } from 'mobx'
import { GetRoute } from '../../../routing/types'
import { Route } from 'type-route'
import { DataStoreSetManyData, RequestStatus } from '../../../store/forum/types'
import { IBoardEx, IBoardExMin } from '../../../../common/forum/forum.ex.interfaces'
import { IForumBoardManyResponse } from '../../../../common/responses/forum.responses'
import { routes } from '../../../routing'
import { omit } from '../../../../common/utils/object'
import { ICategory } from '../../../../common/forum/forum.base.interfaces'
import { CategoryPrepareService } from '../category/category-prepare.service'

const BOARD_LIST_EXPIRED = 30

export class BoardPrepareService {
  private readonly boardService = resolve<BoardService>(BoardServiceSymbol)
  private readonly categoryPrepareService = resolve<CategoryPrepareService>(CategoryPrepareServiceSymbol)

  constructor () {
    makeObservable(this)
    setTimeout(() => this.prepareAll())
  }

  @action.bound
  processRoute (route?: StoredRoute): boolean {
    if (isRoute(route, 'boardList')) {
      mute(this.boardList(route))
      return true
    }

    return false
  }


  @action.bound
  async boardList (route: GetRoute<'boardList'>) {
    const status = this.getStatus(route)
    if (status) {
      return
    }

    try {
      this.setStatus(route, 'pending')
      await this.categoryPrepareService().prepareAll()
      const boards = await this.boardService().getAll()
      this.setStatus(route, 'loaded', boards)
    } catch (e) {
      console.warn(e)
      this.setStatus(route, 'error')
    }
  }

  private getStatus (route: GetRoute<'boardList'>) {
    const pageProps: RouteDataItem | undefined = store.routeDataStore.props.get(route.href)
    return pageProps?.data?.status
  }

  private setStatus = (route: GetRoute<'boardList'>, status: RequestStatus, boards?: IForumBoardManyResponse) => runInAction(() => {
    if (boards) {
      store.routeDataStore.setPageProps(route, { status: status, data: { boards } }, BOARD_LIST_EXPIRED)
    } else {
      store.routeDataStore.setPageProps(route, { status: status})
    }
  })

  @action
  async prepareAndGet (boardId: number): Promise<IBoardExMin | undefined> {
    const status = store.forumStore.boardStore.getStatus('getAll', false)

    if (!status || status === 'error') {
      await this.prepareAll()
    }
    if (status !== 'loaded') {
      await when(() => store.forumStore.boardStore.getStatus('getAll', false) === 'loaded')
    }

    return runInAction(() => {
      return store.forumStore.boardStore.get(boardId)
    })
  }


  @action
  async prepareAll() {
    const status = store.forumStore.boardStore.getStatus('getAll', false)
    if (status) {
      return
    }

    try {
      store.forumStore.boardStore.setStatus('getAll', false, 'pending')

      const boardList = await this.boardService().getAll()

      runInAction(() => {
        store.forumStore.boardStore.setMany({
          items: boardList.map(board => omit(board, 'counters', 'last'))
        })

        store.forumStore.boardStore.setStatus('getAll', false, 'loaded')
      })
    } catch {
      store.forumStore.boardStore.setStatus('getAll', false, 'error')
    }
  }

}
