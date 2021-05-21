import { IBreadcrumbsStore, IMyStore, IRouteStore, ISeoStore, IUIStore } from './types'
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx'
import { isModalRoute } from '../routing/utils'
import { routerSession } from '../routing'
import { AppRoute } from '../routing/types'
import { store } from './index'


const HISTORY_LENGTH = 20

// const asAppRoute = (route: StoredRoute): AppRoute => route as AppRoute

export class RouteStore implements IRouteStore {
  constructor () {
    makeObservable(this)

    runInAction(() => {
      this.history = [routerSession.getInitialRoute()]
    })
    routerSession.listen(this.handleRouter)
  }

  @observable
  history: AppRoute[] = []

  @observable
  saved: AppRoute | undefined = undefined

  @action.bound
  handleRouter (toRoute: AppRoute): void {
    switch (toRoute.action) {
      case 'push':
        if (!this.current || this.current.href !== toRoute.href) {
          this.history = [toRoute, ...this.history].slice(0, HISTORY_LENGTH)
        }
        break
      case 'pop':
        if (this.last?.href === toRoute.href) {
          this.history = [toRoute, ...this.history.slice(2)]
        } else if (!this.current || this.current.href !== toRoute.href) {
          this.history = [toRoute, ...this.history].slice(0, HISTORY_LENGTH)
        }
        break
      case 'replace':
        if (this.last?.href === toRoute.href) {
          this.history = [...this.history.slice(1)]
        } else {
          this.history = [toRoute, ...this.history.slice(1)]
        }
        break
    }
    //todo синхронизировать историю согласно route.action = 'pop' | 'replace' | 'push'
    // this.save(route)
  }

  @action.bound
  clearSaved (): void {
    this.saved = undefined
  }

  @action.bound
  setSaved (route: AppRoute): void {
    this.saved = route
  }

  // @action.bound
  // pushSaved (): void {
  //   if (this.saved) {
  //     this.push(this.saved)
  //     this.clearSaved()
  //   }
  // }
  //
  // @action.bound
  // replaceSaved (): void {
  //   if (this.saved) {
  //     this.replace(this.saved)
  //     this.clearSaved()
  //   }
  // }


  // @action.bound
  // save (route: AppRoute | AppRoute) {
  //   this.history = [
  //     route,
  //     ...this.history,
  //   ].slice(0, HISTORY_LENGTH)
  // }

  @computed
  get current () {
    return this.history.length > 0 ? this.history[0] : undefined
  }

  @computed
  get last () {
    return this.history.length > 1 ? this.history[1] : undefined
  }

  @computed
  get isModal () {
    return this.current ? isModalRoute(this.current) : false
  }

  @computed
  get noModalRoute () {
    return this.history.find(r => !isModalRoute(r))
  }

  //
  // @action.bound
  // push (current: AppRoute): void {
  //   if (!this.last || this.last.href !== current.href) {
  //     asAppRoute(current).push()
  //   }
  // }

  @action.bound
  back (): void {
    routerSession.back()
  }

  @action.bound
  reload (): void {
    // ToDo
    // session.
  }

  //
  // @action.bound
  // replace (route: AppRoute): void {
  //   this.history = this.history.slice(1)
  //   asAppRoute(route).replace()
  // }
}
