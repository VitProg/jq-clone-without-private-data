import {
  DataStoreGetMethods,
  DataStoreSetData,
  DataStoreSetManyData,
  ExtractDataItem,
  ExtractItem,
  ExtractPageProps,
  IBoardStore,
  IForumStore, RequestStatus
} from './types'
import { action, makeObservable, observable, reaction, runInAction, when } from 'mobx'
import {
  dataStoreClear,
  dataStoreDeserializeItems,
  dataStoreFlush,
  dataStoreGet, dataStoreGetAll,
  dataStoreGetMany, dataStoreGetStatus, dataStoreGetStatusHash,
  dataStoreSerializeItems,
  dataStoreSet,
  dataStoreSetMany, dataStoreSetStatus
} from './utils'
import { GetFirstArgumentType } from '../../../common/utils/types'
import { computedFn } from 'mobx-utils'


type Store = BoardStore
type StoreType = 'board'
type PageProps = ExtractPageProps<StoreType>
type DataItem = ExtractDataItem<StoreType>
type Item = ExtractItem<StoreType>

const LOCAL_STORAGE_KEY = 'js-board-storage'

export class BoardStore implements IBoardStore {
  constructor (public forumStore: IForumStore) {
    makeObservable(this,)

    when(
      () => this.items.size > 0,
      () => {
        // localStorage.setItem(LOCAL_STORAGE_KEY, dataStoreSerializeItems(this))
      },
    )

    // const items = dataStoreDeserializeItems(this, localStorage.getItem(LOCAL_STORAGE_KEY))
    // localStorage.removeItem(LOCAL_STORAGE_KEY)
    // if (items) {
    //   runInAction(() => {
    //     this.items = items
    //     this.setStatus('getAll', false, 'loaded')
    //   })
    // }

    // this.flushInterval = setInterval(() => {
    //   console.log('!!!', this.name, 'auto flush')
    //   this.flush()
    // }, (this.defaultExpireIn / 2 * 1000) >>> 0)

  }

  readonly flushInterval: number | undefined

  readonly name = 'board' as const
  readonly defaultExpireIn: number = 60 * 10 // 30 sec //60 * 60 // 1 hour
  readonly maxStoredItems: number = 200

  @observable statuses: Map<string, RequestStatus> = new Map<string, RequestStatus>()

  @observable.deep items: Map<number, DataItem> = new Map()

  @action.bound
  flush (): void {
    dataStoreFlush(this)
  }

  @action.bound
  clear (): void {
    dataStoreClear(this)
  }

  @action.bound
  set (data: DataStoreSetData<Item>): Item | undefined {
    return dataStoreSet(this, data)
  }

  @action.bound
  setMany (data: DataStoreSetManyData<Item>): Item[] {
    return dataStoreSetMany(this, data)
  }

  get (id: number): Item | undefined {
    return dataStoreGet(this, id)
  }

  getMany<AsRecord extends true | false = false> (
    idList: number[],
    asRecord?: AsRecord,
  ): AsRecord extends true ? Record<number, Item> : Item[] {
    return dataStoreGetMany(this, idList, asRecord)
  }

  getAll <AsRecord extends true | false = false>(
    asRecord: AsRecord,
    parentId?: number,
  ): AsRecord extends true ? Record<number, Item> : Item[] {
    if (typeof parentId !== 'undefined') {
      const data: Item[] = dataStoreGetAll(this, false)

      const result: any = asRecord ? {} : []
      for (const item of data) {
        // if (parentId === item.linksId.parent) {
        if (parentId === item.parentId) {
          if (asRecord) {
            result[item.id] = item
          } else {
            result.push(item)
          }
        }
      }
      return result
    } else {
      return dataStoreGetAll(this, asRecord)
    }
  }

  getStatus <M extends DataStoreGetMethods>(type: M, props: GetFirstArgumentType<Store[M]>): RequestStatus | undefined {
    return dataStoreGetStatus(this, type, props)
  }

  @action.bound
  setStatus <M extends DataStoreGetMethods>(type: M, props: GetFirstArgumentType<Store[M]>, status: RequestStatus | undefined): RequestStatus | undefined {
    return dataStoreSetStatus(this, type, props, status)
  }
}
