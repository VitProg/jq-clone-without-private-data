import { StoredRoute } from '../store/types'
import { Route } from 'type-route'
import { isObject } from '../../common/type-guards'
import { store } from '../store'
import { modalRoutes, routes } from '.'
import {
  AppRoute,
  AppRouteKeys,
  AppRouteKeysWithoutProps,
  AppRouteKeysWithProps,
  ExtractRouteProps,
  RouteSwitchProps, OptionalProps
} from './types'
import { RouteDataTypes } from '../routes'
import { AnyObject } from '../../common/utils/types'

export const isModalRoute = (route: StoredRoute | string) => {
  const name = typeof route === 'string' ? route : route?.name
  return modalRoutes.includes(name as any)
}

export const isRoute = <N extends keyof typeof routes = keyof typeof routes>(val: any, route?: N): val is Route<(typeof routes)[N]> => {
  if (!val || !isObject(val)) {
    return false
  }
  if (route) {
    return (val as Route<any>)?.name === route
  }

  return 'name' in val &&
    'params' in val &&
    'href' in val &&
    'link' in val
}

const withPrepareData = (props: any): props is RouteSwitchProps<any> => 'prepareData' in props && typeof props.prepareData === 'function'

export const routeSwitch = <N extends keyof typeof routes>(props: RouteSwitchProps<N>) => {
  const { currentRoute, name, guard, saveRedirect, render } = props

  if (currentRoute && currentRoute.name === name) {
    if (guard) {
      const guardCheck = guard(currentRoute as any)

      if (!guardCheck) {
        return null
      }

      if (isRoute(guardCheck)) {
        if (!!saveRedirect) {
          store.routeStore.setSaved(currentRoute)
        }
        currentRoute.replace()
        // store.routeStore.replace(guardCheck)
        return null
      }
    }
    //
    // let preparedData: AnyObject | undefined
    // if (withPrepareData(props)) {
    //   preparedData = props.prepareData(route as any)
    // }

    const RenderResult: any = render(currentRoute as any)

    if (RenderResult.$$typeof === Symbol.for('react.element')) {
      return RenderResult
    }

    return <RenderResult key={currentRoute.href} route={currentRoute}/>
  }

  return null
}


export function specifyCurrentRoute<
  S extends true | false,
  RN extends AppRouteKeys,
  RP extends OptionalProps<ExtractRouteProps<RN> | undefined>
>(
  sign: S,
  routeName: RN,
  routeProps: RP,
): void {
  if (!sign || !store.routeStore.current) {
    return
  }

  if (routeProps && 'page' in routeProps && (routeProps as any).page <= 1) {
    return
  }

  try {
    const checkedRoute = routes[routeName](routeProps as any)

    if (store.routeStore.current.href !== checkedRoute.href) {
      checkedRoute.replace()
    }
  } catch (e) {
    console.warn(e)
  }
}
