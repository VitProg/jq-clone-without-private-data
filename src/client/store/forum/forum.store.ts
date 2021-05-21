import {
  DataStore,
  ExtractItem,
  ForumStoreType,
  ForumStoreTypeEX,
  GetForumStore,
  IBoardStore,
  ICategoryStore,
  IForumStore,
  IMessageStore,
  ITopicStore,
  IUserStore,
  Model,
  RelationsRecord, RelationsSingle
} from './types'
import { IRouteStore, IUIStore } from '../types'
import { getBlankRelationsItem, getBlankRelationsRecord } from './utils'
import { BoardStore } from './board.store'
import { CategoryStore } from './category.store'
import { TopicStore } from './topic.store'
import { UserStore } from './user.store'
import { makeObservable } from 'mobx'
import { MessageStore } from './message.store'


export class ForumStore implements IForumStore {
  readonly boardStore: IBoardStore
  readonly categoryStore: ICategoryStore
  readonly messageStore: IMessageStore
  readonly topicStore: ITopicStore
  readonly userStore: IUserStore

  constructor (
    readonly routeStore: IRouteStore,
    readonly uiStore: IUIStore,
  ) {
    this.boardStore = new BoardStore(this)
    this.categoryStore = new CategoryStore(this)
    this.messageStore = new MessageStore(this)
    this.topicStore = new TopicStore(this)
    this.userStore = new UserStore(this)

    setInterval(() => {
      this.boardStore.flush()
    }, 1000)

    makeObservable(this, {})
  }

  getRelationsForList<DataType extends ForumStoreType, Item extends ExtractItem<GetForumStore<DataType>>> (
    dataType: DataType,
    items: Item[] | undefined,
  ): RelationsRecord<DataType> {
    const relations = getBlankRelationsRecord(dataType)

    // todo check it
    if (items) {
      for (const item of items as Model[]) {
        this.fillRelations(true, relations, item.linksId, dataType)
      }
    }
    return relations
  }

  getRelationsForItem<DataType extends ForumStoreType, Item extends ExtractItem<GetForumStore<DataType>>> (
    dataType: DataType,
    item: Item | undefined,
  ): RelationsSingle<DataType> {
    const relations = getBlankRelationsItem(dataType)

    // todo check it
    if (item && 'linksId' in item) {
      this.fillRelations(false, relations, (item as any).linksId, dataType)
    }
    return relations
  }

  private fillRelations<
    M extends true | false,
    R extends (M extends true ? RelationsRecord<any> : RelationsSingle<any>),
  > (
    many: M,
    relations: R,
    linksId: Partial<Record<ForumStoreType, number>> | undefined,
    currentType: ForumStoreType
  ) {
    if (!linksId) {
      return
    }

    //todo foll relations from other relation
    for (const [dt, id] of Object.entries(linksId)) {
      if (id) {
        if (many && !(dt in relations)) {
          (relations as any)[dt] = {}
        }

        const check = many ?
          !(id in (relations as any)[dt]) :
          !(relations as any)[dt]

        if (check) {
          const dataType = (dt === 'parent' ? currentType : dt) as ForumStoreType
          const store = this.getStore(dataType)
          if (!store) {
            console.warn(`DataStore for ${dataType} not found!`)
          } else {
            const item = store.get(id) as Model
            if (item) {
              if (many) {
                (relations as any)[dt][id] = item
              } else {
                (relations as any)[dt] = item
              }

              this.fillRelations(many, relations, item.linksId, dataType)
            }
          }
        }
      }
    }
  }

  getStore<DataType extends ForumStoreTypeEX> (dataType: DataType): GetForumStore<DataType> {
    switch (dataType) {
      case 'firstMessage':
      case 'lastMessage':
        return this.messageStore as any
      case 'lastTopic':
        return this.topicStore as any
      case 'lastUser':
        return this.userStore as any
    }
    return (this as any)[dataType + 'Store']
  }

  clearAll () {
    this.messageStore.clear()
    this.boardStore.clear()
    this.categoryStore.clear()
    this.topicStore.clear()
    this.userStore.clear()
  }
}
