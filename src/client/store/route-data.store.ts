import { IMyStore, IRouteDataStore, IRouteStore, RouteDataItem } from './types'
import { action, makeObservable, observable, reaction } from 'mobx'
import { AppRoute, RoutePagePropsByRoute } from '../routing/types'
import { computedFn } from 'mobx-utils'

import { isString, isUndefined } from '../../common/type-guards'


const HISTORY_LENGTH = 20

// const asAppRoute = (route: StoredRoute): AppRoute => route as AppRoute

export class RouteDataStore implements IRouteDataStore {
  constructor (
    readonly routeStore: IRouteStore,
    readonly myStore: IMyStore,
  ) {
    makeObservable(this)
    // makeAutoObservable(this, {
    //   routeStore: false,
    // })

    // setInterval(this.flush, 5000)

    let lastIsAuth: boolean | undefined

    reaction(
      () => [
        this.routeStore.noModalRoute,
        this.myStore.isAuth,
      ],
      async (current: any[], last: any[]) => {
        if (current?.[0]?.href === last?.[0]?.href && current?.[1] === last?.[1]) {
          return
        }

        // const currentHref = this.routeStore.noModalRoute?.href
        // if (currentHref && this.props.has(currentHref)) {
        //   console.log('ReactDataStore reset expiredAt for current route', currentHref)
        //   this.props.get(currentHref)!.expireAt = undefined
        // }

        if (!isUndefined(lastIsAuth) && lastIsAuth !== this.myStore.isAuth) {
          this.clearAll()
        } else {
          this.flush()
        }

        lastIsAuth = this.myStore.isAuth
      })
  }

  @observable
  readonly props: Map<string, RouteDataItem> = new Map()

  @action.bound
  flush () {
    console.group('ReactDataStore - flush called')

    const currentHref = this.routeStore.noModalRoute?.href
    const now = Date.now()

    for (const [route, item] of this.props) {
      if (route !== currentHref) {
        if (item.expired && !item.expireAt) {
          item.expireAt = now + (item.expired * 1000)
          console.log('ReactDataStore', route, 'expired after', ((item.expireAt - now) / 1000) >>> 0, 'sec')
        }

        if (item.expireAt && item.expireAt < now || (!item.expired && !item.expireAt)) {
          this.remove(route)
        }
      }
    }
    console.groupEnd()
  }

  @action.bound
  clearAll () {
    console.log('ReactDataStore', 'clearAllPageProps')
    this.props.clear()
  }

  @action.bound
  setPageProps<R extends AppRoute> (route: R, props?: RoutePagePropsByRoute<R>, expired?: number) {
    console.log('ReactDataStore', 'setPageProps', route.href, { props, expired })
    if (props) {
      this.props.set(route.href, {
        data: props,
        expired,
      })
    } else {
      this.remove(route)
    }
  }

  @action.bound
  remove<R extends AppRoute | string> (route: R) {
    if (isString(route)) {
      console.log('ReactDataStore', 'remove', route)
      this.props.delete(route)
    } else {
      console.log('ReactDataStore', 'remove', (route as AppRoute).href)
      this.props.delete((route as AppRoute).href)
    }
  }

  // @action.bound
  getPageProps = computedFn(function getPageProps<R extends AppRoute> (
    this: RouteDataStore,
    route: R,
    // resetExpiredAt = true,
  ): RoutePagePropsByRoute<R> {
    console.log('ReactDataStore', 'getPageProps', route.href)
    if (!route) {
      return {
        status: 'error',
      } as any
    }

    const href = route.href
    // debugger
    if (!this.props.has(href)) {
      this.setPageProps(
        route,
        {
          ...route.params,
          status: 'pending',
        } as any
      )
    }

    const stored = this.props.get(route.href)

    // if (resetExpiredAt && stored?.expireAt) {
    //   stored.expireAt = undefined
    //   console.log('ReactDataStore reset expired for', route.href)
    // }

    return stored?.data
  })

  get<R extends AppRoute> (route: R): RoutePagePropsByRoute<R> | undefined {
    return this.props.get(route.href)?.data
  }

}
