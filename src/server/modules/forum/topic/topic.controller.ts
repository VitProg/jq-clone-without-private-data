import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common'
import { TopicManyResponse } from '../responses/topic-many.response'
import { WithUser } from '../../auth/decorators/with-user'
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { TopicDbService } from './topic-db.service'
import { BoardDbService } from '../board/board-db.service'
import { User } from '../../auth/decorators/user'
import { ConfigService } from '@nestjs/config'
import { ApiQueryPagination } from '../../../swagger/decorators/api-query-pagination'
import { ParseIntOptionalPipe } from '../../../pipes/parse-int-optional.pipe'
import { TopicService } from './topic.service'
import { getUserLevel } from '../../../../common/forum/utils'
import { IUserEx } from '../../../../common/forum/forum.ex.interfaces'
import { Sorting } from '../../../types'
import { ApiPipeNumbers } from '../../../swagger/decorators/api-pipe-numbers'
import { ParsePipedIntPipe } from '../../../pipes/parse-piped-int.pipe'
import { TopicExModel } from '../models-ex/topic-ex.model'
import { UserLevel } from '../../../../common/forum/forum.constants'


const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5


@ApiTags('topic')
@Controller('topic')
export class TopicController {
  readonly pageSize = parseInt(this.configService.get('FORUM_TOPIC_PAGE_SIZE', '25'), 10)

  constructor (
    private readonly topicDbService: TopicDbService,
    private readonly topicService: TopicService,
    private readonly boardService: BoardDbService,
    private readonly configService: ConfigService,
  ) {
  }

  //
  // @WithUser()
  // @Get('')
  // @ApiQueryPagination()
  // // @ApiPipeStrings({
  // //   name: 'relations',
  // //   where: 'query',
  // //   enum: TopicAllRelations,
  // //   enumName: 'TopicAllRelations',
  // //   required: false,
  // // })
  // async findAll (
  //   @Query('page', new ParseIntOptionalPipe({ min: 1 })) page = 1,
  //   @Query('pageSize', new ParseIntOptionalPipe({ min: 5 })) pageSize = this.pageSize,
  //   // @Query('relations', new ParsePipedStringPipe()) withRelations: TopicRelationsArray = [],
  //   @User() user?: IUserEx,
  // ): Promise<TopicManyResponse> {
  //   const userLevel = getUserLevel(user)
  //   return this.topicService.findAll({
  //     userLevel,
  //     pagination: {
  //       limit: pageSize,
  //       page,
  //     },
  //   })
  //   // const boardIds = await this.boardService.availableBoardIdsForUser(user)
  //   //
  //   // const data = await this.topicService.paginate({
  //   //   boardIds,
  //   //   pagination: { page, limit: pageSize },
  //   // })
  //   //
  //   // data.relations = await this.topicService.getRelations(data.items, withRelations)
  //   //
  //   // return data
  // }

  @WithUser()
  @Get('board/:boardId')
  @ApiParam({ name: 'boardId', type: Number })
  @ApiQueryPagination()
  @ApiQuery({ name: 'order', type: String, required: false }) // ToDo !!!
  @ApiQuery({ name: 'sorting', type: String, required: false }) // ToDo !!!
  @ApiQuery({ name: 'sticky', type: Boolean, required: false })
  async findByBoard (
    @Param('boardId', ParseIntPipe) boardId: number,
    @Query('page', new ParseIntOptionalPipe({ min: 1 })) page = 1,
    @Query('pageSize', new ParseIntOptionalPipe({
      min: MIN_ITEMS_ON_PAGE,
      max: MAX_ITEMS_ON_PAGE
    })) pageSize = this.pageSize,
    @Query('order') order?: string,
    @Query('sorting') sorting?: Sorting,
    @Query('sticky') sticky?: string, // todo
    @User() user?: IUserEx,
  ): Promise<TopicManyResponse> {
    const userLevel = getUserLevel(user)
    return this.topicService.findAll({
      userLevel,
      boardId,
      pagination: {
        limit: pageSize,
        page,
      },
      orderBy: order as any,
      sorting: sorting ?? 'desc',
      stickyFirst: !!sticky,
    })
  }

  @WithUser()
  @Get('latest')
  @ApiQueryPagination()
  async findLatest (
    @Query('page', new ParseIntOptionalPipe({ min: 1 })) page = 1,
    @Query('pageSize', new ParseIntOptionalPipe({
      min: MIN_ITEMS_ON_PAGE,
      max: MAX_ITEMS_ON_PAGE
    })) pageSize = this.pageSize,
    @User() user?: IUserEx,
  ): Promise<TopicManyResponse> {
    const userLevel = getUserLevel(user)
    return this.topicService.findAll({
      userLevel,
      pagination: {
        limit: pageSize,
        page,
      },
      orderBy: 'latest',
    })
  }

  @WithUser()
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  async findById (
    @Param('id', ParseIntPipe) id: number,
    @User() user?: IUserEx
  ): Promise<TopicExModel | undefined> {
    const data = await this.findByIds([id], user)

    const single = data?.[0]
    if (!single) {
      throw new NotFoundException()
    }
    return single
  }

  @WithUser()
  @Get('many/:ids')
  @ApiPipeNumbers('ids', 'param')
  async findByIds (
    @Param('ids', ParsePipedIntPipe) ids: number[],
    @User() user?: IUserEx,
  ): Promise<TopicExModel[]> {
    const userLevel = getUserLevel(user)
    return this.topicService.findByIds(ids, userLevel)
  }

}
