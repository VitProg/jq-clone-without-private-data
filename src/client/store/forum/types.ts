import { IRouteStore, IUIStore } from '../types'
import { IBoard, ICategory, IMessage, ITopic, IUser } from '../../../common/forum/forum.base.interfaces'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'
import { AnyObject, GetFirstArgumentType } from '../../../common/utils/types'
import {
  BoardRelationsRecord,
  BoardRelationsSingle,
  MessageRelationsRecord,
  MessageRelationsSingle,
  TopicRelationsRecord,
  TopicRelationsSingle
} from '../../../common/forum/forum.entity-relations'
import { IBoardEx, IBoardExMin, IMessageEx, ITopicEx, IUserEx } from '../../../common/forum/forum.ex.interfaces'


export type Hash = string
export type Model = AnyObject & {id: number, linksId?: Partial<Record<ForumStoreType, number>>}
export type RequestStatus = 'loaded' | 'pending' | 'error'

export interface IForumStore {
  readonly routeStore: IRouteStore
  readonly uiStore: IUIStore

  readonly messageStore: IMessageStore
  readonly topicStore: ITopicStore
  readonly boardStore: IBoardStore
  readonly categoryStore: ICategoryStore
  readonly userStore: IUserStore

  getRelationsForList <DataType extends ForumStoreType, Item extends ExtractItem<GetForumStore<DataType>>>(
    dataType: DataType,
    items: Item[] | undefined,
  ): RelationsRecord<DataType>

  getRelationsForItem <DataType extends ForumStoreType, Item extends ExtractItem<GetForumStore<DataType>>>(
    dataType: DataType,
    item: Item | undefined
  ): RelationsSingle<DataType>

  getStore<DataType extends ForumStoreType> (dataType: DataType): GetForumStore<DataType>

  clearAll(): void
}

export interface IMessageStore extends DataStorePages<IMessageEx, MessageDataPageProps> {
}

export interface ITopicStore extends DataStorePages<ITopicEx, TopicDataPageProps> {
}

export interface IBoardStore extends DataStore<IBoardExMin> {
  getAll <AsRecord extends true | false = false>(
    asRecord: AsRecord,
    parentId?: number,
  ): AsRecord extends true ? Record<number, IBoardExMin> : IBoardExMin[]
}

export interface ICategoryStore extends DataStore<ICategory> {
}

export interface IUserStore extends DataStorePages<IUserEx, UserDataPageProps> {
  readonly prepareByNameItems: ReadonlyArray<string>
  readonly triedPrepareByNameItems: ReadonlyArray<string>
  readonly hasPrepareByNameItems: boolean
  clearPrepareByNameItems(): void
  getByName (name: string): IUserEx | undefined
}

export type MessageDataPageProps = {
  meta: IPaginationMeta
  type: 'latest' | 'topic' | 'user' | 'search'
  topic?: number
  user?: number
  search?: string
}

export type UserDataPageProps = {
  meta: IPaginationMeta
}

export type TopicDataPageProps = {
  meta: IPaginationMeta
  type: 'board' | 'user' | 'search'
  board?: number
  user?: number
  search?: string
}

export type PageData<T extends Model, PageProps extends { meta: IPaginationMeta } > = {items: Array<T>, meta: IPaginationMeta, props: PageProps}

export type DataStoreGetMethods = 'get' | 'getMany' | 'getAll'

export type DataStore<T extends Model, DataEx extends AnyObject = {}, ItemEx extends AnyObject = {}> = {
  forumStore: IForumStore
  items: Map<number, DataItem<T, ItemEx>>
  statuses: Map<string, RequestStatus>
  maxStoredItems?: number
  defaultExpireIn?: number
  name: string

  flush (): void
  clear (): void

  set (data: DataStoreSetData<T>): T | undefined

  setMany (data: DataStoreSetManyData<T>): T[]

  get (id: number): T | undefined

  getMany <AsRecord extends true | false = false>(
    idList: number[],
    asRecord: AsRecord,
  ): (AsRecord extends true ? Record<number, T> : T[])

  getAll <AsRecord extends true | false = false>(
    asRecord: AsRecord,
  ): AsRecord extends true ? Record<number, T> : T[]

  getStatus <M extends DataStoreGetMethods>(type: M, props: GetFirstArgumentType<DataStore<T, DataEx, ItemEx>[M]>): RequestStatus | undefined
  setStatus <M extends DataStoreGetMethods>(type: M, props: GetFirstArgumentType<DataStore<T, DataEx, ItemEx>[M]>, status: RequestStatus | undefined): RequestStatus | undefined
} & DataEx

export type DataStorePagesGetMethods = DataStoreGetMethods | 'getPage'


export type DataStorePages<T extends Model, PageProps extends { meta: IPaginationMeta } = { meta: IPaginationMeta }, DataEx extends AnyObject = {}, ItemEx extends AnyObject = {}> =
  Omit<DataStore<T, DataEx, { hash: Hash[] } & ItemEx>, 'set' | 'setMany' | 'getStatus' | 'setStatus'> &
  {
    pages: Record<Hash, PageProps>

    getPage (data: DataStorePagesGetPageData<PageProps>): {items: T[], meta: IPaginationMeta} | undefined
    getPageMeta (data: DataStorePagesGetPageMetaData<PageProps>): Omit<IPaginationMeta, 'currentPage'> | undefined

    set (data: DataStorePagesSetData<PageProps, T>): T | undefined
    setMany (data: DataStorePagesSetManyData<PageProps, T>): T[]
    setPage (data: DataStorePagesSetManyData<PageProps, T>): T[]
    removePage (data: DataStorePagesRemovePageData<PageProps>): void

    getStatus <M extends DataStorePagesGetMethods>(type: M, props: GetFirstArgumentType<DataStorePages<T, PageProps, DataEx, ItemEx>[M]>): RequestStatus | undefined
    setStatus <M extends DataStorePagesGetMethods>(type: M, props: GetFirstArgumentType<DataStorePages<T, PageProps, DataEx, ItemEx>[M]>, status: RequestStatus | undefined): RequestStatus | undefined
  }

export type DataItem<T extends Model, ItemEx extends AnyObject = {}> = {
  item: T
  updatedAt: number,
  expireIn?: number
} & ItemEx

export type DataStoreSetData<T extends Model> = {item: T, expireIn?: number}
export type DataStoreSetManyData<T extends Model> = {items: T[] | Record<number, T>, expireIn?: number}
export type DataStorePagesSetData<PageProps extends { meta: IPaginationMeta }, T extends Model> = DataStoreSetData<T> & {pageProps?: PageProps}
export type DataStorePagesSetManyData<PageProps extends { meta: IPaginationMeta }, T extends Model> = DataStoreSetManyData<T> & {pageProps?: PageProps}
export type DataStorePagesRemovePageData<PageProps extends { meta: IPaginationMeta }> = Omit<PageProps, 'meta'> & { page: number | '*' }
export type DataStorePagesGetPageData<PageProps extends { meta: IPaginationMeta }> = Omit<PageProps, 'meta'> & { page: number }
export type DataStorePagesGetPageMetaData<PageProps extends { meta: IPaginationMeta }> = Omit<PageProps, 'meta'>
export type DataStorePagesSetPageData<PageProps extends { meta: IPaginationMeta }, T extends Model> = PageData<T, PageProps>

type _ExtractPageProps<T> = T extends DataStorePages<any, infer PageProps> ? PageProps : never
export type ExtractPageProps<T> = T extends ForumStoreType ? _ExtractPageProps<GetForumStore<T>> : _ExtractPageProps<T>

type __ExtractItem<T> = T extends { items: Map<number, {item: infer T}> } ? T : never
export type ExtractItem<T> = T extends ForumStoreType ? __ExtractItem<GetForumStore<T>> : __ExtractItem<T>

type _ExtractDataItem<T> = T extends { items: Map<number, DataItem<infer T, infer ItemEx>> } ? DataItem<T, ItemEx> : never
export type ExtractDataItem<T> = T extends ForumStoreType ? _ExtractDataItem<GetForumStore<T>> : _ExtractDataItem<T>

type _ExtractSetArg<T> = T extends { items: Map<number, any>, set: (data: infer T) => void } ? T: never
export type ExtractSetArg<T> = T extends ForumStoreType ? _ExtractSetArg<GetForumStore<T>> : _ExtractSetArg<T>

type _ExtractGetPageArg<T> = T extends { items: Map<number, any>, getPage: (data: infer T) => any } ? T: never
export type ExtractGetPageArg<T> = T extends ForumStoreType ? _ExtractGetPageArg<GetForumStore<T>> : _ExtractGetPageArg<T>

export type ExtractPageStoreDataEx<T> =
  T extends IMessage ? MessageDataPageProps :
  T extends 'message' ? MessageDataPageProps :
  T extends IMessageStore ? MessageDataPageProps :
      T extends ITopicEx ? TopicDataPageProps :
      T extends 'topic' ? TopicDataPageProps :
      T extends ITopicStore ? TopicDataPageProps :
          never


export type ForumStoreType = 'message' | 'topic' | 'board' | 'category' | 'user'
export type ForumStoreTypeEX = ForumStoreType | 'lastMessage' | 'firstMessage' | 'lastTopic' | 'lastUser'
export type ForumPagesStoreType = Extract<ForumStoreType, 'message' | 'topic'>
export type ForumSimpleStoreType = Extract<ForumStoreType, 'board' | 'category' | 'user'>
export type ForumCachedStoreType = Extract<ForumStoreType, 'board' | 'category'>
export type ForumNoPagesStoreType = Exclude<ForumStoreType, ForumPagesStoreType>

export type GetForumStore<T extends ForumStoreType | ForumStoreTypeEX> = {
  message: IMessageStore
  topic: ITopicStore
  board: IBoardStore
  category: ICategoryStore
  user: IUserStore
  lastMessage: IMessageStore
  firstMessage: IMessageStore
  lastTopic: ITopicStore
  lastUser: IUserStore
}[T]

export type GetForumItem<R extends ForumStoreType> = {
  message: IMessage
  topic: ITopicEx
  board: IBoardEx
  category: ICategory
  user: IUser
}

export type ForumStores = IMessageStore | ITopicStore | IBoardStore | ICategoryStore | IUserStore

export type RelationsRecord<T extends Model | ForumStoreType> =
  T extends (IMessage | 'message') ? MessageRelationsRecord :
    T extends (ITopic | ITopicEx | 'topic') ? TopicRelationsRecord :
      T extends (IBoard | IBoardEx | 'board') ? BoardRelationsRecord :
        {}

export type RelationsSingle<T extends Model | ForumStoreType> =
  T extends (IMessage | 'message') ? MessageRelationsSingle :
    T extends (ITopic | ITopicEx | 'topic') ? TopicRelationsSingle :
      T extends (IBoard | IBoardEx | 'board') ? BoardRelationsSingle :
        {}
