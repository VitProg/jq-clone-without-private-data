import { Controller, Get, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { BoardDbService } from './board-db.service'
import { WithUser } from '../../auth/decorators/with-user'
import { User } from '../../auth/decorators/user'
import { getUserLevel } from '../../../../common/forum/utils'
import { ParseIntOptionalPipe } from '../../../pipes/parse-int-optional.pipe'
import { BoardService } from './board.service'
import { IBoardEx, IUserEx } from '../../../../common/forum/forum.ex.interfaces'
import { Sorting } from '../../../types'


const DEVELOPMENT = process.env.NODE_ENV !== 'production'

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor (
    private readonly boardDbService: BoardDbService,
    private readonly boardService: BoardService,
  ) {
  }

  @WithUser()
  @Get('')
  @ApiQuery({ name: 'parent', type: Number, required: false })
  @ApiQuery({ name: 'level', type: Number, required: false })
  @ApiQuery({ name: 'category', type: Number, required: false })
  @ApiQuery({ name: 'order', type: String, required: false }) // ToDo !!!
  @ApiQuery({ name: 'sorting', type: String, required: false }) // ToDo !!!
  async getAll (
    @User() user?: IUserEx,
    @Query('parent', ParseIntOptionalPipe) parent?: number,
    @Query('level', ParseIntOptionalPipe) level?: number,
    @Query('category', ParseIntOptionalPipe) category?: number,
    @Query('order') order?: string,
    @Query('sorting') sorting?: Sorting,
  ): Promise<IBoardEx[]> {
    // const userLevel = randomItem(Object.values(UserLevel)) ?? UserLevel.guest// getUserLevel(user)
    const userLevel = getUserLevel(user)

    return this.boardService.findAll({
      userLevel,
      orderBy: order as any,
      sorting: sorting ?? 'asc',
      withGroups: false,
      categoryId: category,
      parentId: parent,
      level,
    })
  }
}
