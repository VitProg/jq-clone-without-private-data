import { StoredRoute } from '../../../store/types'
import { isRoute } from '../../../routing/utils'
import { mute } from '../../../../common/utils/promise'
import { resolve } from '../../../ioc/ioc.utils'
import { UserServiceSymbol } from '../../ioc.symbols'
import { UserService } from './user.service'
import { UserDataPageProps } from '../../../store/forum/types'
import { store } from '../../../store'
import { reaction, runInAction } from 'mobx'
import { isArray } from '../../../../common/type-guards'
import { IUserEx } from '../../../../common/forum/forum.ex.interfaces'


export class UserPrepareService {
  private readonly userService = resolve<UserService>(UserServiceSymbol)


  processRoute (route?: StoredRoute): boolean {
    if (isRoute(route, 'user')) {
      mute(this.prepareAndGet(route.params.user.id))
      return true
    }

    if (isRoute(route, 'users')) {
      mute(this.preparePage({
        page: route.params.page ?? 1
      }))
      return true
    }

    reaction(
      () => store.forumStore.userStore.prepareByNameItems,
      () => {
        if (store.forumStore.userStore.hasPrepareByNameItems) {
          mute(this.prepareByNames([...store.forumStore.userStore.prepareByNameItems]))
          store.forumStore.userStore.clearPrepareByNameItems()
        }
      },
      {
        delay: 100,
      }
    )

    return false
  }

  async preparePage (pageProps: { page: number } & Omit<UserDataPageProps, 'meta'>): Promise<void> {
    const { page, ...props } = pageProps

    const status = store.forumStore.userStore.getStatus('getPage', pageProps)
    if (status) {
      return
    }

    runInAction(() => {
      store.forumStore.userStore.setStatus('getPage', pageProps, 'error')
    })

    // todo
    // try {
    //   store.forumStore.userStore.setStatus('getPage', pageProps, 'pending')
    //
    //   console.log('Prepare data for', pageProps)
    //
    //   const data = await this.load(pageProps)
    //
    //   if (!data) {
    //     store.forumStore.userStore.setStatus('getPage', pageProps, undefined)
    //     return
    //   }
    //
    //   runInAction(() => {
    //     store.forumStore.userStore.setPage({
    //       items: data.items,
    //       pageProps: {
    //         ...props,
    //         meta: data.meta,
    //       }
    //     })
    //
    //     store.forumStore.userStore.setStatus('getPage', pageProps, 'loaded')
    //   })
    // } catch (e) {
    //   console.warn(e)
    //   runInAction(() => {
    //     store.forumStore.userStore.setStatus('getPage', pageProps, 'error')
    //   })
    // }
  }

  async prepareByNames (names: readonly string[]): Promise<void> {
    const namesToRequest: string[] = []
    names.forEach(name => {
      const user = store.forumStore.userStore.getByName(name)
      if (!user) {
        namesToRequest.push(name)
      }
    })

    if (!namesToRequest.length) {
      return
    }

    const items = await this.userService().byNames(namesToRequest)

    store.forumStore.userStore.setMany({ items })
  }

  async prepareAndGet<N extends number | number[]> (id: N): Promise<(N extends number ? IUserEx : IUserEx[]) | undefined> {
    const isSingle = !isArray(id)
    const ids = (isArray(id) ? id : [id]).sort() as number[]

    const fromStore = store.forumStore.userStore.getMany(ids, false)

    if (fromStore && fromStore.length > 0) {
      return (isSingle ? fromStore[0] : fromStore) as any
    }

    try {
      store.forumStore.userStore.setStatus('getMany', ids, 'pending')

      const items = await this.userService().byIds(ids)

      if (!items) {
        store.forumStore.userStore.setStatus('getMany', ids, undefined)
        return
      }

      store.forumStore.userStore.setMany({ items })

      store.forumStore.userStore.setStatus('getMany', ids, 'loaded')

      return (isSingle ? items[0] : items) as any
    } catch {
      runInAction(() => {
        store.forumStore.userStore.setStatus('getMany', ids, 'error')
      })
    }
  }


  private async load (pageProps: { page: number } & Omit<UserDataPageProps, 'meta'>) {
    return this.userService().page({
      page: pageProps.page,
      pageSize: store.configStore.forumMessagePageSize,
    })
  }
}
