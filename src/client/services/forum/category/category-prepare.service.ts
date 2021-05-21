import { store } from '../../../store'
import { ICategory } from '../../../../common/forum/forum.base.interfaces'
import { uniqueArray } from '../../../../common/utils/array'
import { action, makeObservable, runInAction, when } from 'mobx'
import { resolve } from '../../../ioc/ioc.utils'
import { BoardPrepareServiceSymbol } from '../../ioc.symbols'
import { BoardPrepareService } from '../board/board-prepare.service'


export class CategoryPrepareService {
  private readonly boardPrepareService = resolve<BoardPrepareService>(BoardPrepareServiceSymbol)

  constructor () {
    makeObservable(this)
  }

  @action
  async prepareAll () {
    const status = store.forumStore.categoryStore.getStatus('getAll', false)
    const boardStatus = store.forumStore.categoryStore.getStatus('getAll', false)

    if (status === 'pending') {
      await when(() => store.forumStore.categoryStore.getStatus('getAll', false) !== 'pending')
      return
    }

    if (status) {
      return
    }

    store.forumStore.categoryStore.setStatus('getAll', false, 'pending')

    if (!boardStatus) {
      await this.boardPrepareService().prepareAll()
    }

    runInAction(() => {
      try {
        const boardList = store.forumStore.boardStore.getAll(false)
        const boardRecord = store.forumStore.boardStore.getAll(true)
        const categoryPartList = boardList.map(board => board.category)
        const categoryList: ICategory[] = uniqueArray(categoryPartList).map((category, order) => ({
          ...category,
          settings: {
            order
          }
        }))

        store.forumStore.categoryStore.setMany({
          items: categoryList
        })

        store.forumStore.categoryStore.setStatus('getAll', false, 'loaded')
      } catch {
        store.forumStore.categoryStore.setStatus('getAll', false, 'error')
      }
    })
  }
}
