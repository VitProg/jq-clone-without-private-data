import { User } from '../../common/forum/models/user'
import {
  AppRoute,
  AppRouteKeys,
  ExtractRouteProps,
  RoutePagePropsByName,
  RoutePagePropsByRoute
} from '../routing/types'
import { Theme } from '@material-ui/core'
import { IForumStore } from './forum/types'
import { ReactNode } from 'react'
import { useRoutePagination } from '../hooks/use-route-pagination'


export interface IRootStore {
  readonly uiStore: IUIStore
  readonly seoStore: ISeoStore
  readonly myStore: IMyStore
  readonly routeStore: IRouteStore
  readonly routeDataStore: IRouteDataStore
  readonly forumStore: IForumStore
  readonly configStore: IConfigStore
  readonly breadcrumbsStore: IBreadcrumbsStore

  setupPageMetadata<R extends AppRouteKeys = AppRouteKeys> (config: SetupPageMetadataConfig<R>): void
}

export interface SetupPageMetadataConfig<R extends AppRouteKeys = AppRouteKeys> {
  title?: string,
  pageTitle?: string,
  setPageTitle?: boolean,
  setBreadcrumbs?: boolean,
  setSeoTitle?: boolean,
  pagination?: ReturnType<typeof useRoutePagination>,
  routes?: Array<[label: string, route: AppRoute] | false>
}

export interface IConfigStore {
  readonly isDevelopment: boolean
  readonly forumAvatarBaseUrl: string
  readonly forumGalleryBaseUrl: string
  readonly forumAttachmentsBaseUrl: string
  readonly seoBaseTitle: string | undefined
  readonly seoBaseDescription: string | undefined
  readonly seoBaseKeywords: string[]

  readonly forumMessagePageSize: number
  readonly forumMessageLatestMaxPages: number
  readonly forumTopicPageSize: number
  readonly forumUserPageSize: number

  getAvatarUrl (avatar?: string): string | undefined
}

export interface IUIStore {
  readonly loading: boolean
  readonly theme: Theme
  readonly darkMode: boolean
  readonly pageTitle?: string | ReactNode

  setDarkMode (value: boolean): void

  setLoading (value: boolean): void

  setPageTitle (title: string | ReactNode | undefined): void

  clearPageTitle (): void
}

export interface IMyStore {
  readonly user?: User
  readonly token?: string

  setUser (user: User, token?: string): void

  setToken (token?: string): void

  clearUser (): void

  readonly isAuth: boolean
}

export type StoredRoute = Omit<AppRoute, 'push' | 'replace'>

export interface IRouteStore {
  readonly history: AppRoute[]

  readonly noModalRoute: AppRoute | undefined
  readonly last: AppRoute | undefined
  readonly current: AppRoute | undefined
  readonly isModal: boolean

  readonly saved: AppRoute | undefined

  // push(route: AppRoute): void
  // replace(route: AppRoute): void
  reload (): void

  back (): void

  setSaved (route: AppRoute): void

  clearSaved (): void

  // pushSaved(): void
  // replaceSaved(): void
}

export type RouteDataItem<R extends AppRouteKeys = any> =
  {
    data: RoutePagePropsByName<R>
    expired?: number
    expireAt?: number
  }

export interface IRouteDataStore {
  readonly routeStore: IRouteStore

  readonly props: Map<string, RouteDataItem>

  clearAll (): void

  setPageProps<R extends AppRoute> (route: R, props?: RoutePagePropsByRoute<R>, expired?: number): void
  remove(route: AppRoute): void

  flush(): void

  // prepare<R extends AppRoute> (route?: R): void
  getPageProps<R extends AppRoute> (route: R): RoutePagePropsByRoute<R>

  get <R extends AppRoute> (route: R): RoutePagePropsByRoute<R> | undefined
  // process<R extends AppRoute> (route: R): RoutePageProps<R>
}

export interface ISeoStore {
  readonly configStore: IConfigStore

  setBase (data: { title?: string, keywords?: string[], description?: string }): void

  setTitle (...titles: (string | undefined | null)[]): void

  addTitle (...titles: (string | undefined | null)[]): void

  setKeywords (...keywords: (string | undefined | null)[]): void

  addKeyword (...keywords: (string | undefined | null)[]): void

  setDescription (description: string | undefined | null): void

  setPageSeo (data: { title?: string[], keywords?: string[], description?: string }): void

  clear (): void
}

export interface IBreadcrumbsStore {
  readonly items: BreadcrumbsItem[]
  readonly has: boolean

  set (...items: BreadcrumbsItem[]): void

  add (...items: BreadcrumbsItem[]): void

  removeLast (): void

  clear (): void
}

export type BreadcrumbsItem<R extends AppRouteKeys = AppRouteKeys> =
  {
    route: R,
    routeProps?: ExtractRouteProps<R>
    label: string,
  } |
  string
