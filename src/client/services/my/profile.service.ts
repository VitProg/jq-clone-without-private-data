import { IProfileService } from './types'
import { inject, resolve } from '../../ioc/ioc.utils'
import { IApiService } from '../types'
import { makeAutoObservable } from 'mobx'
import { ApiServiceSymbol } from '../ioc.symbols'
import { IProfileResponse } from '../../../common/responses/forum.responses'


export class ProfileService implements IProfileService {
  private readonly api = resolve<IApiService>(ApiServiceSymbol)

  constructor () {
    makeAutoObservable(this)
  }

  async profile (): Promise<IProfileResponse | undefined> {
    return this.api()
      .get<IProfileResponse>(
        'my/profile',
        {
          withJWTHeaders: true,
        }
      )
  }
}
