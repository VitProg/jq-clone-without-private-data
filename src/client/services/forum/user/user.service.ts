import { ApiServiceSymbol } from '../../ioc.symbols'
import { IApiService } from '../../types'
import { makeAutoObservable } from 'mobx'
import { uniqueArray } from '../../../../common/utils/array'
import { IUserEx } from '../../../../common/forum/forum.ex.interfaces'
import { resolve } from '../../../ioc/ioc.utils'


export class UserService {
  private readonly api = resolve<IApiService>(ApiServiceSymbol)

  // constructor () {
  //   makeAutoObservable(this)
  // }

  async page (request: any) {
    // todo
    return []
  }

  async byId (id: number) {
    try {
      return await this.api()
        .get<IUserEx | undefined>(`user/${id}`)
    } catch {
      return undefined
    }
  }

  async byIds (ids: number[]) {
    if (ids.length === 0) {
      return [] as IUserEx[]
    }

    if (ids.length === 1) {
      const item = await this.byId(ids[0])
      return item ? [item] : []
    }

    try {
      const items = await this.api()
        .get<IUserEx[]>(`user/many/${uniqueArray(ids).join('|')}`)
      return items ?? []
    } catch {
      return [] as IUserEx[]
    }
  }

  async byNames (names: string[]): Promise<IUserEx[]> {
    try {
      if (!names || !names.length) {
        return []
      }

      const users = await this.api()
        .post<IUserEx[]>(`user/name`, {
          json: { names }
        })

      return users ?? []
    } catch {
      return []
    }
  }
}
