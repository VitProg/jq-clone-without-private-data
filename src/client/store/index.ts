import { RootStore } from './root.store'
import { IRootStore } from './types'
import remotedev from 'mobx-remotedev';
import { configure } from 'mobx'

const isDevelopment = process.env.NODE_ENV !== 'production'
const devTools = false

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: false,
})




export const store: IRootStore = devTools ? remotedev(new RootStore(), {
  name: 'App',
  global: true,
  onlyActions: true,
}) : new RootStore()
// export const store: IRootStore = new RootStore()

if (isDevelopment) {
  (window as any)._store_ = store
}
