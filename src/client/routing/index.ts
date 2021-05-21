import { definedRoutes, modalRoutes} from '../routes'
import { createRouter } from 'type-route'

const {
  RouteProvider,
  routes,
  session: routerSession,
} = createRouter(definedRoutes)


export { RouteProvider }
export { routes }
export { routerSession }
export { modalRoutes }
