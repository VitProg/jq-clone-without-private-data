import { inject, resolve } from '../../../ioc/ioc.utils'
import { ApiServiceSymbol } from '../../ioc.symbols'
import { IApiService } from '../../types'
import { IBoard } from '../../../../common/forum/forum.base.interfaces'
import { IForumBoardDynamicData, IForumBoardManyResponse } from '../../../../common/responses/forum.responses'


export class BoardService {
  private readonly api = resolve<IApiService>(ApiServiceSymbol)

  async getAll(): Promise<IForumBoardManyResponse> {
    const result = await this.api()
      .get<IForumBoardManyResponse>(
        'board'
      )
    return result ?? []
  }

  async getStat(ids: number[]): Promise<IForumBoardDynamicData[]> {
    const result = await this.api()
      .post<IForumBoardDynamicData[]>(
        `board/stat`,
        {
          json: { ids, withUser: true, },
        },
      )
    return result ?? []
  }

}
