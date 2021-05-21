import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { MessageAllRelations, MessageRelationsArray } from '../../../../common/forum/forum.entity-relations'
import { between } from '../../../../common/utils/number'
import { MessageManyResponse } from '../responses/message-many.response'
import { ApiQueryPagination } from '../../../swagger/decorators/api-query-pagination'
import { ConfigService } from '@nestjs/config'
import { WithUser } from '../../auth/decorators/with-user'
import { User } from '../../auth/decorators/user'
import { IUser } from '../../../../common/forum/forum.base.interfaces'
import { BoardDbService } from '../board/board-db.service'
import { ApiPipeStrings } from '../../../swagger/decorators/api-pipe-strings'
import { ParsePipedStringPipe } from '../../../pipes/parse-piped-string.pipe'
import { ParseIntOptionalPipe } from '../../../pipes/parse-int-optional.pipe'
import { ApiPipeNumbers } from '../../../swagger/decorators/api-pipe-numbers'
import { ParsePipedIntPipe } from '../../../pipes/parse-piped-int.pipe'
import { MessageModel } from '../models/message.model'
import { getUserLevel } from '../../../../common/forum/utils'
import { MessageService } from './message.service'
import { IMessageEx } from '../../../../common/forum/forum.ex.interfaces'
import { MessageExModel } from '../models-ex/message-ex.model'
import { AccountBalanceWalletTwoTone } from '@material-ui/icons'
import { MessageDbService } from './message-db.service'


const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5


@ApiTags('message')
@Controller('message')
export class MessageController {
  readonly pageSize = parseInt(this.configService.get('FORUM_MESSAGE_PAGE_SIZE', '10'), 10)
  readonly latestMaxPages = parseInt(this.configService.get('FORUM_MESSAGE_LATEST_MAX_PAGES', '10'), 10)

  constructor (
    private readonly messageService: MessageService,
    private readonly messageDbService: MessageDbService,
    private readonly boardService: BoardDbService,
    private readonly configService: ConfigService,
  ) {
  }


  @WithUser()
  @Get('latest')
  @ApiQueryPagination()
  async latest (
    @User() user?: IUser,
    @Query('page', ParseIntOptionalPipe) page = 1,
    @Query('pageSize', ParseIntOptionalPipe) pageSize = this.pageSize,
  ): Promise<MessageManyResponse> {
    if (page > this.latestMaxPages) {
      throw new NotFoundException('Maximum number of pages - 10')
    }

    const userLevel = getUserLevel(user)
    const data = await this.messageService.findAll({
      userLevel,
      sorting: 'desc',
      pagination: {
        limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
        page,
      },
      withBoard: true,
      withTopic: true,
      withUser: true,
      withFullInfo: true,
    })
    data.meta.totalPages = Math.min(this.latestMaxPages, data.meta.totalPages)

    return data
  }


  // ////////////////////////////////////////////////////////////////////
  // @WithUser()
  // @Get('latest-old')
  // @ApiQueryPagination()
  // @ApiPipeStrings({
  //   name: 'relations',
  //   where: 'query',
  //   enum: MessageAllRelations,
  //   enumName: 'MessageAllRelations',
  //   required: false,
  // })
  // async latestOld (
  //   @User() user?: IUser,
  //   @Query('page', ParseIntOptionalPipe) page = 1,
  //   @Query('pageSize', ParseIntOptionalPipe) pageSize = this.pageSize,
  //   @Query('relations', ParsePipedStringPipe) withRelations: MessageRelationsArray = [],
  // ) {
  //   if (page > this.latestMaxPages) {
  //     throw new NotFoundException('Maximum number of pages - 10')
  //   }
  //
  //   const boardIds = await this.boardService.availableBoardIdsForUser(user)
  //
  //   const result = await this.messageDbService.findAll({
  //     pagination: {
  //       limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
  //       page,
  //     },
  //     boardIds,
  //     sort: 'DESC',
  //   })
  //   result.meta.totalPages = Math.min(this.latestMaxPages, result.meta.totalPages);
  //
  //   const relations = await this.messageDbService.getRelations(result.items, withRelations)
  //
  //   return {
  //     meta: result.meta,
  //     items: result.items,
  //     relations,
  //   }
  // }
  // ////////////////////////////////////////////////////////////////////


  @WithUser()
  @Get('topic/:topicId')
  @ApiQueryPagination()
  async findByTopic (
    @Param('topicId', ParseIntPipe) topicId: number,
    @Query('page', ParseIntOptionalPipe) page = 1,
    @Query('pageSize', ParseIntOptionalPipe) pageSize = this.pageSize,
    @User() user?: IUser,
  ): Promise<MessageManyResponse> {
    const userLevel = getUserLevel(user)
    return this.messageService.findAll({
      userLevel,
      topicId,
      sorting: 'asc',
      pagination: {
        limit: pageSize,
        page,
      },
      withBoard: false,
      withTopic: false,
      withUser: true,
      withFullInfo: true,
    })
  }

  @WithUser()
  @Get(':id')
  @ApiQuery({ name: 'id', type: Number })
  async findById (
    @Param('id', ParseIntPipe) id: number,
    @User() user?: IUser,
  ): Promise<MessageExModel | undefined> {
    const arr = await this.findByIds([id], user)
    return arr[0]
  }

  @WithUser()
  @Get('many/:ids')
  @ApiPipeNumbers('ids', 'param')
  async findByIds (
    @Param('ids', ParsePipedIntPipe) ids: number[],
    @User() user?: IUser,
  ): Promise<MessageExModel[]> {
    const userLevel = getUserLevel(user)
    return this.messageService.findByIds(
      ids,
      userLevel,
      {
        withBoard: true,
        withTopic: true,
        withUser: true,
        withFullInfo: true,
      },
    )
  }


}
