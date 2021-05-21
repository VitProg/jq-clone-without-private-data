import { BreadcrumbsItem, IBreadcrumbsStore } from './types'
import { action, computed, makeObservable, observable } from 'mobx'


export class BreadcrumbsStore implements IBreadcrumbsStore {
  constructor () {
    makeObservable(this)
  }

  @observable
  items: BreadcrumbsItem[] = []

  @computed
  get has(): boolean {
    return this.items.length > 0
  }

  @action.bound
  set (...items: BreadcrumbsItem[]): void {
    this.items = [...items]
  }

  @action.bound
  add (...items: BreadcrumbsItem[]): void {
    this.items.push(...items)
  }

  @action.bound
  removeLast (): void {
    const items = [...this.items]
    items.pop()
    this.items = items
  }

  @action.bound
  clear (): void {
    this.items = []
  }
}
