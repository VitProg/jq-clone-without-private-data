import {
  DataStorePagesGetMethods,
  DataStorePagesGetPageData, DataStorePagesGetPageMetaData, DataStorePagesRemovePageData,
  DataStorePagesSetData,
  DataStorePagesSetManyData,
  DataStorePagesSetPageData,
  ExtractDataItem,
  ExtractItem,
  ExtractPageProps,
  Hash,
  IForumStore,
  ITopicStore, RequestStatus
} from './types'
import { action, makeObservable, observable } from 'mobx'
import {
  dataStoreClear,
  dataStoreFlush,
  dataStoreGet, dataStoreGetAll,
  dataStoreGetMany, dataStoreGetStatus,
  dataStorePagerGetPage, dataStorePagerGetPageMeta, dataStorePagesRemovePage,
  dataStorePagesSet,
  dataStorePagesSetMany, dataStoreSetStatus
} from './utils'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'
import { GetFirstArgumentType } from '../../../common/utils/types'


type Store = TopicStore
type StoreType = 'topic'
type PageProps = ExtractPageProps<StoreType>
type DataItem = ExtractDataItem<StoreType>
type Item = ExtractItem<StoreType>


export class TopicStore implements ITopicStore {
  constructor (public forumStore: IForumStore) {
    makeObservable(this)

    // this.flushInterval = setInterval(() => {
    //   console.log('!!!', this.name, 'auto flush')
    //   this.flush()
    // }, (this.defaultExpireIn / 2 * 1000) >>> 0)

  }

  readonly flushInterval: number | undefined

  readonly name = 'topic' as const
  readonly defaultExpireIn: number = 10 // 60 sec //5 * 60 // 5 minutes
  readonly maxStoredItems: number = 100

  @observable.deep readonly items: Map<number, DataItem> = new Map()
  @observable.deep pages: Record<Hash, PageProps> = {}
  @observable statuses: Map<string, RequestStatus> = new Map<string, RequestStatus>()

  @action
  flush (): void {
    dataStoreFlush(this)
  }

  @action.bound
  clear (): void {
    dataStoreClear(this)
  }

  @action.bound
  set (data: DataStorePagesSetData<PageProps, Item>): Item | undefined {
    return dataStorePagesSet(this, data)
  }

  setMany (data: DataStorePagesSetManyData<PageProps, Item>): Item[] {
    return dataStorePagesSetMany(this, data)
  }

  get (id: number): Item | undefined {
    return dataStoreGet(this, id)
  }

  getMany<AsRecord extends true | false = false> (
    idList: number[],
    asRecord: AsRecord,
  ): AsRecord extends true ? Record<number, Item> : Item[] {
    return dataStoreGetMany(this, idList, asRecord)
  }

  getAll <AsRecord extends true | false = false>(
    asRecord: AsRecord,
  ): AsRecord extends true ? Record<number, Item> : Item[] {
    return dataStoreGetAll(this, asRecord)
  }

  getPage (data: DataStorePagesGetPageData<PageProps>): { items: Item[], meta: IPaginationMeta } | undefined {
    return dataStorePagerGetPage(this, data)
  }

  getPageMeta (data: DataStorePagesGetPageMetaData<PageProps>): Omit<IPaginationMeta, 'currentPage'> | undefined {
    return dataStorePagerGetPageMeta(this, data)
  }

  setPage (data: DataStorePagesSetPageData<PageProps, Item>): Item[] {
    return this.setMany(data)
  }

  removePage (data: DataStorePagesRemovePageData<PageProps>): void {
    dataStorePagesRemovePage(this, data)
  }

  getStatus <M extends DataStorePagesGetMethods>(type: M, props: GetFirstArgumentType<Store[M]>): RequestStatus | undefined {
    return dataStoreGetStatus(this, type, props)
  }

  setStatus <M extends DataStorePagesGetMethods>(type: M, props: GetFirstArgumentType<Store[M]>, status: RequestStatus | undefined): RequestStatus | undefined {
    return dataStoreSetStatus(this, type, props, status)
  }
}
