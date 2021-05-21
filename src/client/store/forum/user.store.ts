import {
  DataStorePagesGetMethods,
  DataStorePagesGetPageData,
  DataStorePagesGetPageMetaData,
  DataStorePagesRemovePageData,
  DataStorePagesSetData,
  DataStorePagesSetManyData,
  DataStorePagesSetPageData,
  ExtractDataItem,
  ExtractItem,
  ExtractPageProps,
  Hash,
  IForumStore,
  IUserStore,
  RequestStatus
} from './types'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import {
  dataStoreClear,
  dataStoreFlush,
  dataStoreGet,
  dataStoreGetAll,
  dataStoreGetMany,
  dataStoreGetStatus,
  dataStorePagerGetPage,
  dataStorePagerGetPageMeta,
  dataStorePagesRemovePage,
  dataStorePagesSet,
  dataStorePagesSetMany,
  dataStoreSetStatus
} from './utils'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'
import { GetFirstArgumentType } from '../../../common/utils/types'
import { computedFn } from 'mobx-utils'
import { IUserEx } from '../../../common/forum/forum.ex.interfaces'


type Store = UserStore
type StoreType = 'user'
type PageProps = ExtractPageProps<StoreType>
type DataItem = ExtractDataItem<StoreType>
type Item = ExtractItem<StoreType>


export class UserStore implements IUserStore {
  constructor (public forumStore: IForumStore) {
    makeObservable(this)
  }

  readonly name = 'user' as const
  readonly defaultExpireIn: number = 5 * 60 // 5 minutes
  readonly maxStoredItems: number = 500

  @observable.deep readonly items: Map<number, DataItem> = new Map()
  @observable.deep pages: Record<Hash, PageProps> = {}
  @observable statuses: Map<string, RequestStatus> = new Map<string, RequestStatus>()
  @observable.shallow prepareByNameItems: string[] = []
  @observable.shallow triedPrepareByNameItems: string[] = []

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

  ///

  getByName = computedFn(function getNyName (this: Store, name: string): IUserEx | undefined {
    const filteredUsers: IUserEx[] = []

    for (const [, {item}] of this.items) {
      if (item.name === name) {
        filteredUsers.push(item)
      }
    }

    const user = filteredUsers.pop()

    if (!user) {
      if (!this.prepareByNameItems.includes(name) && !this.triedPrepareByNameItems.includes(name)) {
        runInAction(() => {
          this.triedPrepareByNameItems = [
            ...this.triedPrepareByNameItems,
            name,
          ]
          this.prepareByNameItems = [
            ...this.prepareByNameItems,
            name,
          ]
        })
      }
    }

    return user
  })

  @action.bound
  clearPrepareByNameItems() {
    this.prepareByNameItems = []
  }

  @computed
  get hasPrepareByNameItems() {
    return this.prepareByNameItems.length > 0
  }
}
