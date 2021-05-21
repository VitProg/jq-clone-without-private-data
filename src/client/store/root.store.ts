import { action, makeAutoObservable, makeObservable, reaction, runInAction } from 'mobx'
import {
  IBreadcrumbsStore,
  IConfigStore,
  IMyStore,
  IRootStore, IRouteDataStore,
  IRouteStore,
  ISeoStore,
  IUIStore,
  SetupPageMetadataConfig
} from './types'
import { UIStore } from './ui.store'
import { MyStore } from './my.store'
import { RouteStore } from './route.store'
import { SeoStore } from './seo.store'
import { ForumStore } from './forum/forum.store'
import { IForumStore } from './forum/types'
import { ConfigStore } from './config.store'
import { BreadcrumbsStore } from './breadcrumbs.store'
import { store } from './index'
import { AppRoute, AppRouteKeys, ExtractRouteProps } from '../routing/types'
import { omit } from '../../common/utils/object'
import { NonUndefined } from 'react-hook-form'
import { RouteDataStore } from './route-data.store'


export class RootStore implements IRootStore {
  configStore!: IConfigStore
  uiStore!: IUIStore
  seoStore!: ISeoStore
  myStore!: IMyStore
  routeStore!: IRouteStore
  routeDataStore!: IRouteDataStore
  forumStore!: IForumStore
  breadcrumbsStore!: IBreadcrumbsStore

  constructor () {
    runInAction(() => {
      this.configStore = new ConfigStore()
      this.uiStore = new UIStore()
      this.seoStore = new SeoStore(this.configStore)
      this.myStore = new MyStore()
      this.breadcrumbsStore = new BreadcrumbsStore()
      this.routeStore = new RouteStore()
      this.routeDataStore = new RouteDataStore(this.routeStore, this.myStore)
      this.forumStore = new ForumStore(this.routeStore, this.uiStore)
    })

    makeObservable(this)

    let lastIsAuth: boolean | undefined

    reaction(
      () => [
        this.routeStore.current,
        this.routeStore.noModalRoute,
        this.myStore.isAuth,
      ],
      () => {
        this.uiStore.clearPageTitle()
        this.seoStore.setTitle(null)
        this.breadcrumbsStore.clear()
      }
    )
  }

  @action.bound
  setupPageMetadata<R extends AppRouteKeys = AppRouteKeys> (config: SetupPageMetadataConfig<R>): void {
    this.seoStore.setTitle(null)
    this.uiStore.clearPageTitle()
    this.breadcrumbsStore.clear()

    const {
      setBreadcrumbs = true,
      setPageTitle = true,
      setSeoTitle = true,
    } = config

    if (!setBreadcrumbs && !setPageTitle && !setSeoTitle) {
      return
    }

    if (!config.title && !config.pageTitle) {
      return
    }

    if (setSeoTitle) {
      this.seoStore.setTitle(config.title ?? config.pageTitle)
    }

    if (setPageTitle) {
      this.uiStore.setPageTitle(config.pageTitle ?? config.title)
    }

    if (setBreadcrumbs) {
      const routes = config.routes ?
        config.routes :
        (this.routeStore.current ? [[config.pageTitle ?? config.title, this.routeStore.current]] : [])

      for (const item of routes) {
        if (typeof item !== 'boolean') {
          const a = item
          const [label, route] = item as [string, AppRoute]
          this.breadcrumbsStore.add({
            route: route.name as AppRouteKeys,
            routeProps: omit(route.params as any, 'page'),
            label,
          })
        }
      }
    }


    if (config.pagination?.currentPage) {
      const page = config.pagination?.currentPage

      if (page > 1) {
        const label = config.pagination.totalPages ?
          `${page} из ${config.pagination.totalPages}` :
          config.pagination.currentPage.toString()

        if (setSeoTitle) {
          store.seoStore.addTitle(`Страница: ${page}`)
        }

        if (setBreadcrumbs) {
          store.breadcrumbsStore.add(label)
        }
      }
    }
  }
}
