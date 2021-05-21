import { Route } from 'type-route'
import { routes } from '.'
import { FC, ReactElement } from 'react'
import { AnyObject, IfDefined, ObjectValues } from '../../common/utils/types'
import { RequestStatus } from '../store/forum/types'
import { RouteDataTypes } from '../routes'


export type Routes = typeof routes
export type AppRoute = Route<Routes>
export type GetRoute<RN extends AppRouteKeys> = ReturnType<Routes[RN]>

export type ExtractRouteName<R extends { name: any }> = R['name'] extends AppRouteKeys ? R['name'] : never
export type ExtractRouteProps<R extends keyof typeof routes> = Parameters<(typeof routes)[R]>[0]
export type OptionalProps<R extends AnyObject | undefined> = IfDefined<R, { [K in keyof R]: R[K] | undefined }, undefined>

export type AppRouteKeys = keyof typeof routes
export type AppRouteKeysWithoutProps = ObjectValues<{ [K in AppRouteKeys]: IfDefined<ExtractRouteProps<K>, never, K> }>
export type AppRouteKeysWithProps = ObjectValues<{ [K in AppRouteKeys]: IfDefined<ExtractRouteProps<K>, never, K> }>

export type RouteDataType<R extends AppRouteKeys | any, IfNone extends any = undefined> =
  R extends keyof RouteDataTypes ?
    RouteDataTypes[R] :
    IfNone

// export type RoutePageProps<R extends AppRoute | AppRouteKeys, IfNone extends any = undefined> =
//   R extends AppRoute ? RoutePagePropsByRoute<R, IfNone> : (
//     RoutePagePropsByName<R, IfNone>
//   // R extends AppRouteKeys ?
//   //   RoutePageProps_inner<R, RouteDataType<R, IfNone>> :
//   //   R extends { name: any } ?
//   //     RoutePageProps_inner<ExtractRouteName<R>, RouteDataType<ExtractRouteName<R>, IfNone>> :
//   //     'AAA'

export type RoutePagePropsByRoute<R extends AppRoute> =
  IfDefined<R['params'], R['params'], {}> &
  (R['name'] extends keyof RouteDataTypes ? RoutePreparingData<R['name']> : {})

export type RoutePagePropsByName<R extends AppRouteKeys> =
  RoutePagePropsByRoute<GetRoute<R>>


// type RoutePageProps_inner<R extends AppRouteKeys, NNN> =
//   IfDefined<ExtractRouteProps<R>,
//     ExtractRouteProps<R>,
//     {}> &
//   IfDefined<RouteDataType<R>,
//     RoutePreparingData<R>,
//     {}>

export type RoutePreparingData<R extends AppRouteKeys> = {
  status: RequestStatus
  // data?: RouteDataType<R>
  data?: R extends keyof RouteDataTypes ? RouteDataTypes[R] : undefined
}


export type RouteSwitchProps<N extends keyof typeof routes> =
  {
    name: N,
    currentRoute: AppRoute | undefined,
    guard?: (route: Route<(typeof routes)[N]>) => (undefined | boolean | Route<(typeof routes)>)
    saveRedirect?: boolean
    // } & (RouteDataType<N> extends undefined ?
    //   {
    render: (route: Route<(typeof routes)[N]>) => FC<{ route: typeof route }> | ReactElement,
    // } :
    // {
    //   render: (route: Route<(typeof routes)[N]>) => FC<{ route: typeof route }> | ReactElement,
    // prepareData: (route: Route<(typeof routes)[N]>) => RoutePageProps<N>,
    // }
    // )
  }

// type a = RoutePageProps<'boardTopicList'>

// type b = 'topicMessageList' extends AppRouteKeys ? 'topicMessageList' : never
// type d = GetRoutePreparedDataType<'topicMessageList'>
// type _b = ExtractRouteProps<b>
// type c = RoutePreparedData<b, d>
// type cc = RoutePageProps<b>
// declare const __ : a
// declare const _ : cc
//
// type f = RouteSwitchProps<'boardTopicList'>
// declare const ff: a
// ff.
