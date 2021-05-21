import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { MessageDbService } from './message-db.service'
import { MessageRedisService } from './message-redis.service'
import { IForumMessageManyResponse } from '../../../../common/responses/forum.responses'
import { UserLevel } from '../../../../common/forum/forum.constants'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'
import { Sorting } from '../../../types'
import { IBoardEx, IMessageEx, ITopicEx, IUserEx } from '../../../../common/forum/forum.ex.interfaces'
import { getPaginationResponse } from '../../../common/utils/pagination'
import { toMessageEx } from '../../../common/utils/mapper-ex'
import { BoardService } from '../board/board.service'
import { UserService } from '../../user/user.service'
import { RedisMessageHash } from '../../../common/utils/redis'
import { IMessage } from '../../../../common/forum/forum.base.interfaces'
import { TopicService } from '../topic/topic.service'
import { recordToMap, uniqueArray } from '../../../../common/utils/array'
import { isArray, isNumber } from '../../../../common/type-guards'
import { ConfigService } from '@nestjs/config'


type WithProps = {
  withUser?: boolean
  withTopic?: boolean
  withBoard?: boolean
  withFullInfo?: boolean
}

type FindAllProps =
  (
    // by id list
    {
      ids: number[],
      userLevel?: UserLevel,
    } |
    // latest
    {
      userLevel: UserLevel,
      pagination: IPaginationOptions,
      sorting?: Sorting,
    } |
    // message list in topic
    {
      topicId: number,
      userLevel: UserLevel,
      pagination: IPaginationOptions,
      sorting?: Sorting,
    }
    ) & WithProps


@Injectable()
export class MessageService {
  readonly pageSize = parseInt(this.configService.get('FORUM_MESSAGE_PAGE_SIZE', '10'), 10)

  constructor (
    private readonly db: MessageDbService,
    private readonly redis: MessageRedisService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => BoardService)) private readonly boardService: BoardService,
    @Inject(forwardRef(() => TopicService)) private readonly topicService: TopicService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {
  }

  async findAll<Props extends FindAllProps> (
    props: Props
  ): Promise<Props extends { ids: number[] } ? Record<number, IMessageEx> : IForumMessageManyResponse> {
    const {
      withBoard = false,
      withTopic = false,
      withUser = false,
      withFullInfo = true,
    } = props

    const byIds = 'ids' in props
    const inTopic = !byIds && 'topicId' in props
    const isLatest = !byIds && !inTopic

    const userLevel: UserLevel = ('userLevel' in props ? (props as any).userLevel : undefined) ?? UserLevel.guest
    const topicId: number = 'topicId' in props ? (props as any).topicId : 0
    const sorting: Sorting = isLatest ?
      'desc' :
      ('sorting' in props && (props as any).sorting === 'desc' ? 'desc' : 'asc')
    const pagination: IPaginationOptions = 'pagination' in props ? (props as any).pagination : { page: 0, limit: this.pageSize }


    const resultList: IMessageEx[] = []
    const resultRecord: Record<number, IMessageEx> = {}

    let data: [map: number[] | Map<number, number>, count: number] | undefined
    let ids: number[] = []
    let count = 0
    //todo

    if (byIds) {
      const uniqueIds = uniqueArray<number>((props as any).ids)
      data = [
        uniqueIds,
        uniqueIds.length
      ]
    }
    if (inTopic) {
      data = await Promise.all([
        this.redis.getIdsTopicLastMessage({
          userLevel,
          pagination,
          topicId,
          sorting,
        }),
        this.redis.getCountTopicLastMessage({ userLevel, topicId }),
      ])
    }
    if (isLatest) {
      data = await Promise.all([
        this.redis.getIdsLatest({
          userLevel,
          pagination,
        }),
        this.redis.getCountLatest({ userLevel }),
      ])
    }

    if (data) {
      ids = [...(isArray(data[0]) ? data[0] : data[0].keys())]
      count = data[1]
    }

    const hashMap: Map<number, RedisMessageHash> = await this.redis.getHashListByIds(ids)

    const ex: {
      board?: Map<number, IBoardEx>,
      topic?: Map<number, ITopicEx>,
      user?: Map<number, IUserEx>,
      fullMessage?: Record<number, IMessage>,
    } = {}

    if (withBoard || withTopic || withUser || withFullInfo) {
      const boardIds: Set<number> = new Set()
      const topicIds: Set<number> = new Set()
      const userIds: Set<number> = new Set()

      for (const [id, hash] of hashMap) {
        const { board, topic, user } = hash

        withBoard && boardIds.add(board)
        withTopic && topicIds.add(topic)
        withUser && userIds.add(user)
      }

      const promises: Array<Promise<unknown>> = []

      boardIds.size && promises.push(this.boardService.findByIdsToMap(boardIds))
      topicIds.size && promises.push(this.topicService.findByIdsToMap(topicIds))
      userIds.size && promises.push(this.userService.findByIdsToMap(userIds))
      withFullInfo && promises.push(this.db.findByIdsToMap([...hashMap.keys()]))

      const relDataAll = await Promise.all(promises)

      if (boardIds.size) {
        ex.board = (relDataAll.shift() as Map<number, IBoardEx> | undefined) ?? new Map()
      }
      if (topicIds.size) {
        ex.topic = (relDataAll.shift() as Map<number, ITopicEx> | undefined) ?? new Map()
      }
      if (userIds.size) {
        ex.user = (relDataAll.shift() as Map<number, IUserEx> | undefined) ?? new Map()
      }
      if (withFullInfo) {
        ex.fullMessage = (relDataAll.shift() as Record<number, IMessage> | undefined) ?? {}
      }
    }

    for (const [id, hash] of hashMap) {
      const message = toMessageEx(
        hash, {
          board: ex.board?.get(hash.board),
          topic: ex.topic?.get(hash.topic),
          user: ex.user?.get(hash.user),
          fullMessage: ex.fullMessage?.[id],
        })
      if (byIds) {
        resultRecord[id] = message
      } else {
        resultList.push(message)
      }
    }

    if (byIds) {
      return resultRecord as any
    } else {
      return getPaginationResponse(
        resultList,
        count,
        pagination,
      ) as any
    }
  }


  async findByIdsToMap (ids: number[] | Set<number>, userLevel?: UserLevel,
    withRelations?: WithProps): Promise<Map<number, IMessageEx>> {
    const data = await this.findAll({
      ids: [...ids],
      userLevel,
      ...withRelations,
    })
    return recordToMap(data)
  }

  async findByIds (ids: number[] | Set<number>, userLevel?: UserLevel,
    withRelations?: WithProps): Promise<IMessageEx[]> {
    const data = await this.findAll({
      ids: [...ids],
      userLevel,
      ...withRelations,
    })
    return Object.values(data)
  }

  async getPageNumberInTopic (config: {
    messageId: number,
    pageSize?: number,
    userLevel: UserLevel,
    topicId?: number,
  }): Promise<number> {
    const pageSize = config.pageSize ?? this.pageSize
    const { messageId, userLevel } = config

    const topicId = isNumber(config.topicId) ? config.topicId : (await this.redis.getHashById(config.messageId))?.topic

    if (!topicId || topicId <= 0) {
      return 1
    }
    const ordNumber = await this.redis.getOrdinalNumberInTopic(messageId, topicId, userLevel)
    return Math.ceil(ordNumber / pageSize) + 1
  }
}
