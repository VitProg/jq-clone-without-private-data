import { isArray, isNumber, isObject } from '../../../common/type-guards'
import {
  DataItem,
  DataStore,
  DataStoreGetMethods,
  DataStorePages,
  DataStorePagesGetMethods,
  DataStorePagesGetPageData,
  DataStorePagesGetPageMetaData,
  DataStorePagesRemovePageData,
  DataStorePagesSetData,
  DataStorePagesSetManyData,
  DataStoreSetData,
  DataStoreSetManyData,
  ForumNoPagesStoreType,
  ForumPagesStoreType,
  ForumStoreType,
  GetForumStore,
  Hash,
  MessageDataPageProps,
  Model,
  RelationsRecord, RelationsSingle,
  RequestStatus
} from './types'
import { omit } from '../../../common/utils/object'
import { runInAction } from 'mobx'
import { AnyObject } from '../../../common/utils/types'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import {
  AllRelationsMap,
  BoarAllRelations,
  BoardRelationsRecord, MessageAllRelations,
  MessageRelationsRecord, TopicAllRelations,
  TopicRelationsRecord
} from '../../../common/forum/forum.entity-relations'


export const isMessageDataPageProps = (val: any): val is MessageDataPageProps =>
  isObject(val) && 'type' in val

export const isDataStore = <T extends ForumNoPagesStoreType | undefined> (val: any, type?: T): val is (T extends ForumStoreType ? GetForumStore<T> : DataStore<any>) => {
  return isObject(val) && 'items' in val && 'forumStore' in val && 'statuses' in val && 'flush' in val &&
    (type ? 'name' in val && val.name === type : true)
}
export const isDataStorePages = <T extends ForumPagesStoreType | undefined> (val: any, type?: T): val is (T extends ForumPagesStoreType ? GetForumStore<T> : DataStorePages<any, { meta: IPaginationMeta }>) => {
  return isDataStore(val, type as any) && 'pages' in val
}

export const getBlankRelationsRecord = <DataType extends ForumStoreType> (dataType: DataType): RelationsRecord<DataType> => {
  const res: any = {}
  const allRelations = AllRelationsMap[dataType] ?? []
  allRelations.forEach((i: string) => res[i] = {})
  return res
}

export const getBlankRelationsItem = <DataType extends ForumStoreType> (dataType: DataType): RelationsSingle<DataType> => {
  const res: any = {}
  const allRelations = AllRelationsMap[dataType] ?? []
  allRelations.forEach((i: string) => res[i] = undefined)
  return res
}

export const dataStoreFlush = (store: DataStore<any> | DataStorePages<any, any>) => {
  runInAction(() => {
    const now = Date.now()

    const removedPadeHashes: Set<Hash> = new Set<Hash>()

    for (const [id, data] of store.items) {
      const expireIn = data.expireIn ?? store.defaultExpireIn ?? 0
      const expireAt = data.updatedAt + expireIn * 1000
      if (now > expireAt) {
        console.log('DataStore', store.name, 'flush item', id, data.item)
        store.items.delete(id)
        dataStoreSetStatus(store, 'get', id, undefined)

        if (isDataStorePages(store) && 'hash' in data) {
          data.hash.forEach(hash => removedPadeHashes.add(hash))
        }
      }
    }

    if (isDataStorePages(store) && removedPadeHashes.size > 0) {
      for (const hash of removedPadeHashes) {
        const page = store.pages[hash]
        const p = dataStoreGetPageFromHash(hash)
        if (page && p !== '*') {
          dataStorePagesRemovePage(store, {
            page: p,
            ...omit(page, 'meta'),
          })
        }
      }
    }
  })
}

export const dataStorePagesRemovePage = <PageProps extends { meta: IPaginationMeta }> (
  store: DataStorePages<any, PageProps>,
  data: DataStorePagesRemovePageData<PageProps>
) => {
  runInAction(() => {
    const pageHash = dataStoreGetPageHash(data.page, data)
    if (data.page === '*') {
      const allHash = pageHash.substr(1)
      store.pages = Object.fromEntries(
        Object.entries(store.pages)
          .filter(([hash, v]) => {
            if (hash.endsWith(allHash)) {
              console.log('DataStore', store.name, 'remove page', hash)
              const p = dataStoreGetPageFromHash(hash)
              if (isNumber(p)) {
                dataStorePagesRemoveItemsByPageHash(store, hash)
                dataStoreSetStatus(store, 'getPage', { ...data, page: p }, undefined)
              }
              return false
            }
            return true
          })
      )
    } else {
      dataStorePagesRemoveItemsByPageHash(store, pageHash)
    }

    console.log('DataStore', store.name, 'remove page', pageHash)
    delete store.pages[pageHash]
    dataStoreSetStatus(store, 'getPage', data, undefined)
    store.pages = { ...store.pages }
  })
}

const dataStorePagesRemoveItemsByPageHash = (store: DataStorePages<any>, hash: string) => {
  runInAction(() => {
    const removedPadeHashes: Set<Hash> = new Set<Hash>()

    for (const [id, data] of store.items) {
      if (data.hash.includes(hash)) {
        data.hash.filter(h => h !== hash).map(h => removedPadeHashes.add(h))
        store.items.delete(id)
        dataStoreSetStatus(store, 'get', id, undefined)
      }
    }
  })
}

export const dataStoreClear = (store: DataStore<any> | DataStorePages<any>) => {
  runInAction(() => {
    store.statuses.clear()
    store.items.clear()

    if (isDataStorePages(store)) {
      store.pages = {}
    }
  })
}

export const dataStoreSet = <Item extends Model,
  DS extends DataStore<Item>> (
  store: DS,
  data: DataStoreSetData<Item>,
  needFlush = true,
): Item | undefined => {
  return runInAction(() => {
    const exist = store.items.get(data.item.id)

    if (exist) {
      store.items.set(data.item.id, {
        item: {
          ...exist.item,
          ...data.item,
        },
        expireIn: data.expireIn,
        updatedAt: Date.now(),
      })
    } else {
      store.items.set(data.item.id, {
        item: {
          ...data.item
        },
        updatedAt: Date.now(),
        expireIn: (data.expireIn ?? store.defaultExpireIn ?? 0) >>> 0,
      })
    }
    return store.get(data.item.id)
  })
}

export const dataStoreSetMany = <Item extends Model,
  DS extends DataStore<Item>> (
  store: DS,
  data: DataStoreSetManyData<Item>,
): Item[] => {
  return runInAction(() => {
    const items = isArray(data.items) ? data.items : Object.values(data.items)
    for (const item of items) {
      dataStoreSet(
        store,
        {
          item,
          expireIn: data.expireIn,
        },
        false,
      )
    }
    return store.getMany(items.map(item => item.id), false) ?? []
  })
}

export const dataStorePagesSet = <DS extends DataStorePages<Item, PageProps>,
  Item extends Model,
  PageProps extends { meta: IPaginationMeta }> (
  store: DS,
  data: DataStorePagesSetData<PageProps, Item>,
  needFlush = true,
  _pageHash?: string,
): Item | undefined => {
  return runInAction(() => {
    const exist = store.items.get(data.item.id)

    const savePages = !_pageHash

    const pageHash = _pageHash ?? (data.pageProps ? dataStoreGetPageHash(data.pageProps.meta.currentPage, data.pageProps) : undefined)
    const pageHashMulti = !_pageHash && data.pageProps ? dataStoreGetPageHash('*', data.pageProps) : undefined

    if (exist) {
      store.items.set(data.item.id, {
        item: {
          ...exist.item,
          ...data.item,
        },
        expireIn: data.expireIn,
        updatedAt: Date.now(),
        hash: pageHash ? [...exist.hash, pageHash] : [...exist.hash]
      })
    } else {
      store.items.set(data.item.id, {
        item: {
          ...data.item
        },
        updatedAt: Date.now(),
        expireIn: (data.expireIn ?? store.defaultExpireIn ?? 0) >>> 0,
        hash: pageHash ? [pageHash] : []
      })
    }

    if (savePages) {
      const page = (pageHash ? store.pages[pageHash] : undefined) ?? data.pageProps
      if (page && pageHash) {
        store.pages = {
          ...store.pages,
          [pageHash]: page,
        }
      }

      const pageMulti = (pageHashMulti ? store.pages[pageHashMulti] : undefined) ?? data.pageProps
      if (pageMulti && pageHashMulti) {
        store.pages = {
          ...store.pages,
          [pageHashMulti]: {
            ...pageMulti,
            meta: omit(pageMulti.meta, 'currentPage'),
          },
        }
      }
    }

    return store.get(data.item.id)
  })
}

export const dataStorePagesSetMany = <DS extends DataStorePages<Item, PageProps>,
  Item extends Model,
  PageProps extends { meta: IPaginationMeta }> (
  store: DS,
  data: DataStorePagesSetManyData<PageProps, Item>,
  needFlush = true,
): Item[] => {
  //todo
  return runInAction(() => {
    const pageHash = data.pageProps ? dataStoreGetPageHash(data.pageProps.meta.currentPage, data.pageProps) : undefined
    const pageHashMulti = data.pageProps ? dataStoreGetPageHash('*', data.pageProps) : undefined

    const items = isArray(data.items) ? data.items : Object.values(data.items)
    for (const item of items) {
      dataStorePagesSet(
        store,
        {
          item,
          expireIn: data.expireIn,
          pageProps: data.pageProps,
        },
        false,
        pageHash
      )
    }

    const page = (pageHash ? store.pages[pageHash] : undefined) ?? data.pageProps
    if (page && pageHash) {
      store.pages = {
        ...store.pages,
        [pageHash]: page,
      }
    }

    const pageMulti = (pageHashMulti ? store.pages[pageHashMulti] : undefined) ?? data.pageProps
    if (pageMulti && pageHashMulti) {
      store.pages = {
        ...store.pages,
        [pageHashMulti]: {
          ...pageMulti,
          meta: omit(pageMulti.meta, 'currentPage'),
        },
      }
    }

    return store.getMany(items.map(item => item.id), false)
  })
}


export const dataStoreGet = <DS extends DataStore<Item>, Item extends Model> (store: DS, id: number): Item | undefined => {
  return store.items.get(id)?.item
}

export const dataStoreGetMany = <DS extends DataStore<Item>, Item extends Model, AsRecord extends true | false = false> (
  store: DS,
  idList: number[],
  asRecord?: AsRecord,
): (AsRecord extends true ? Record<number, Item> : Item[]) => {
  if (asRecord) {
    const map: any = {}
    for (const id of idList) {
      const item = store.get(id)
      if (item) {
        map[id] = item
      }
    }
    return map
  } else {
    return idList.map(id => store.get(id)).filter(Boolean) as any
  }
}

export const dataStoreGetAll = <DS extends DataStore<Item>, Item extends Model, AsRecord extends true | false = false> (
  store: DS,
  asRecord?: AsRecord,
): AsRecord extends true ? Record<number, Item> : Item[] => {
  if (asRecord) {
    const map: any = {}
    for (const [id, { item }] of store.items) {
      map[id] = item
    }
    return map
  } else {
    const arr: any = []
    for (const [, { item }] of store.items) {
      arr.push(item)
    }
    return arr
  }
}

export const dataStorePagerGetPage = <Item extends Model,
  PageProps extends { meta: IPaginationMeta }> (
  store: DataStorePages<Item, PageProps>,
  data: DataStorePagesGetPageData<PageProps>,
): { items: Item[], meta: IPaginationMeta } | undefined => {
  const pageHash = dataStoreGetPageHash(data.page, omit(data, 'page'))
  const page = store.pages[pageHash]

  if (!page) {
    return undefined
  }

  const resultItems: Item[] = []
  for (const dataItem of store.items.values()) {
    if (dataItem.hash.includes(pageHash)) {
      resultItems.push(dataItem.item as Item)
    }
  }

  return {
    items: resultItems,
    meta: page.meta,
  }
}

export const dataStorePagerGetPageMeta = <Item extends Model,
  PageProps extends { meta: IPaginationMeta }> (
  store: DataStorePages<Item, PageProps>,
  data: DataStorePagesGetPageMetaData<PageProps>,
): Omit<IPaginationMeta, 'currentPage'> | undefined => {
  const pageHash = dataStoreGetPageHash('*', data)
  const page = store.pages[pageHash]

  if (!page) {
    return undefined
  }

  return omit(page.meta, 'currentPage')
}

export const dataStoreGetStatus = <Item extends Model,
  M extends DataStorePagesGetMethods | DataStoreGetMethods,
  > (
  store: DataStore<Item, any> | DataStorePages<Item, any>,
  type: M,
  props: any
): RequestStatus | undefined => {
  const hash = dataStoreGetStatusHash(type, props)
  return store.statuses.get(hash)
}

export const dataStoreSetStatus = <Item extends Model,
  M extends DataStorePagesGetMethods | DataStoreGetMethods,
> (
  store: DataStore<Item, any> | DataStorePages<Item, any>,
  type: M,
  props: any,
  status: RequestStatus | undefined,
): RequestStatus | undefined => {
  return runInAction(() => {
    const hash = dataStoreGetStatusHash(type, props)
    console.log('DataStore', store.name, 'change status', type, props, status)
    if (status) {
      store.statuses.set(hash, status)
    } else {
      store.statuses.delete(hash)
    }


    if (type === 'getMany' && isArray(props)) {
      const setStatus = status === 'error' ? undefined : status
      props.forEach(id => isNumber(id) && dataStoreSetStatus(store, 'get', id, setStatus))
    }

    return store.statuses.get(hash)
  })
}


export const dataStoreGetPageHash = (
  page: number | '*',
  pageProps: AnyObject,
): Hash => {
  const arr = [
    page,
    ...(
      Object
        .entries(pageProps)
        .filter(i => i[0] !== 'meta' && i[0] !== 'page' && i[0] !== 'dataType')
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(a => a[1])
    )
  ]
  return arr.join(':')
}

export const dataStoreGetPageFromHash = (hash: Hash): number | '*' => {
  const pageString = hash.split(':')?.[0] ?? '*'
  const page = pageString === '*' ? '*' : parseInt(pageString, 10)
  return isNumber(page) ? page : '*'
}

export const dataStoreGetStatusHash = (
  type: string,
  props: any,
): string => {
  const arr: string[] = [type]
  if (isObject(props)) {
    arr.push(...(
      Object
        .entries(props)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(a => a[1])
    ))
  } else if (isArray(props)) {
    arr.push(...(props.map((v: any) => v.toString())))
  } else {
    try {
      arr.push(JSON.stringify(props))
    } catch {
    }
  }
  return arr.join(':')
}


/// SERIALIZE

export const dataStoreSerializeItems = (store: DataStore<any>): string => {
  const entries = [...store.items.entries()]
  return JSON.stringify({
    date: Date.now(),
    entries,
  })
}

export const dataStoreDeserializeItems = <T extends Model, DataEx extends AnyObject = {}, ItemEx extends AnyObject = {}> (
  store: DataStore<T, DataEx, ItemEx>,
  serializedData: string | null
): Map<number, DataItem<T, ItemEx>> | undefined => {
  if (!serializedData) {
    return undefined
  }

  try {
    //todo
    const data: { date: number, entries: Array<[number, DataItem<T, ItemEx>]> } = JSON.parse(serializedData)
    const now = Date.now()
    if (data.date + (store.defaultExpireIn ?? 0) < now) {
      return new Map(data.entries)
    }
  } catch {
  }

  return undefined
}

