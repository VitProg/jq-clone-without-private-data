import {
  DataStoreGetMethods, DataStoreSetData, DataStoreSetManyData,
  ExtractDataItem,
  ExtractItem,
  ExtractPageProps,
  ICategoryStore,
  IForumStore, RequestStatus
} from './types'
import { action, autorun, makeObservable, observable, reaction, runInAction, when } from 'mobx'
import {
  dataStoreClear,
  dataStoreDeserializeItems,
  dataStoreFlush,
  dataStoreGet, dataStoreGetAll,
  dataStoreGetMany, dataStoreGetStatus,
  dataStoreSerializeItems,
  dataStoreSet,
  dataStoreSetMany, dataStoreSetStatus
} from './utils'
import { GetFirstArgumentType } from '../../../common/utils/types'
import { store } from '../index'


type Store = CategoryStore
type StoreType = 'category'
type PageProps = ExtractPageProps<StoreType>
type DataItem = ExtractDataItem<StoreType>
type Item = ExtractItem<StoreType>

const LOCAL_STORAGE_KEY = 'js-category-storage'

export class CategoryStore implements ICategoryStore {
  constructor (public forumStore: IForumStore) {
    makeObservable(this)

    // when(
    //   () => this.items.size > 0,
    //   () => {
    //     localStorage.setItem(LOCAL_STORAGE_KEY, dataStoreSerializeItems(this))
    //   },
    // )
    //
    // const items = dataStoreDeserializeItems(this, localStorage.getItem(LOCAL_STORAGE_KEY))
    // localStorage.removeItem(LOCAL_STORAGE_KEY)
    // if (items) {
    //   runInAction(() => {
    //     this.items = items
    //     this.setStatus('getAll', false, 'loaded')
    //   })
    // }
  }


  readonly name = 'category' as const
  readonly defaultExpireIn: number = 60 * 60 // 1 hour
  readonly maxStoredItems: number = 100

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
    this: Store,
    idList: number[],
    asRecord?: AsRecord,
  ): AsRecord extends true ? Record<number, Item> : Item[] {
    return dataStoreGetMany(this, idList, asRecord)
  }

  getAll <AsRecord extends true | false = false>(
    asRecord: AsRecord,
  ): AsRecord extends true ? Record<number, Item> : Item[] {
    return dataStoreGetAll(this, asRecord)
  }

  getStatus <M extends DataStoreGetMethods>(type: M, props: GetFirstArgumentType<Store[M]>): RequestStatus | undefined {
    return dataStoreGetStatus(this, type, props)
  }

  setStatus <M extends DataStoreGetMethods>(type: M, props: GetFirstArgumentType<Store[M]>, status: RequestStatus | undefined): RequestStatus | undefined {
    return dataStoreSetStatus(this, type, props, status)
  }
}
