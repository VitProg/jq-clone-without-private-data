import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { TopicDbService } from './topic-db.service'
import { TopicRedisService } from './topic-redis.service'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'
import { IForumTopicManyResponse } from '../../../../common/responses/forum.responses'
import { UserLevel } from '../../../../common/forum/forum.constants'
import { Sorting } from '../../../types'
import { IBoardEx, ITopicEx } from '../../../../common/forum/forum.ex.interfaces'
import { toBoardEx, toTopicEx } from '../../../common/utils/mapper-ex'
import { getPaginationResponse } from '../../../common/utils/pagination'
import { MessageService } from '../message/message.service'

type FindAllProps =
  {
    userLevel: UserLevel,
    pagination: IPaginationOptions,
    boardId: number,
    orderBy?: 'last-message' | 'count-message'
    sorting?: Sorting
    stickyFirst?: boolean //todo
  } |
  {
    orderBy?: 'latest'
    userLevel: UserLevel,
    pagination: IPaginationOptions,
  }

@Injectable()
export class TopicService {
  constructor (
    private readonly db: TopicDbService,
    private readonly redis: TopicRedisService,
    @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
  ) {
  }

  async findAll(props: FindAllProps): Promise<IForumTopicManyResponse> {
    const {
      userLevel,
      pagination,
    } = props

    const boardId = 'boardId' in props ? props.boardId : 0
    const orderBy = !boardId ? 'latest' : ('orderBy' in props ? props.orderBy : 'last-message')
    const stickyFirst = 'stickyFirst' in props && !!props.stickyFirst //ToDo
    const sorting: Sorting = 'sorting' in props && props.sorting === 'asc' ? 'asc' : 'desc'


    const resultList: ITopicEx[] = []
    let data: [map: Map<number, number>, count: number] | undefined
    let ids: number[] = []
    let count = 0

    switch (orderBy) {
      case 'latest':
        data = await Promise.all([
          this.redis.getIdsLatest({
            userLevel,
            pagination,
          }),
          this.redis.getCountLatest({ userLevel }),
        ])
        break
      case 'count-message':
        data = await Promise.all([
          this.redis.getIdsCountMessage({
            userLevel,
            boardId,
            sorting,
            stickyFirst,
            pagination,
          }),
          this.redis.getCountCountMessage({ userLevel, boardId }),
        ])
        break
      default:
        data = await Promise.all([
          this.redis.getIdsLastMessage({
            userLevel,
            boardId,
            sorting,
            stickyFirst,
            pagination,
          }),
          this.redis.getCountLastMessage({ userLevel, boardId }),
        ])
        break
    }
    if (data) {
      ids = [...data[0].keys()]
      count = data[1]
    }

    const hashMap = await this.redis.getFullHashListByIds(ids, userLevel)

    for (const [id, hash] of hashMap) {
      const page = hash.lm_id ?
        (await this.messageService.getPageNumberInTopic({
          messageId: hash.lm_id,
          topicId: hash.id,
          userLevel,
        })) :
        undefined
      resultList.push(toTopicEx(hash, page))
    }

    return getPaginationResponse(
      resultList,
      count,
      pagination,
    )
  }

  async findByIdsToMap (ids: number[] | Set<number>, userLevel?: UserLevel): Promise<Map<number, ITopicEx>> {
    const hashMap = await (
      userLevel ?
        this.redis.getFullHashListByIds([...ids], userLevel) :
        this.redis.getHashListByIds([...ids])
    )
    const resultMap: Map<number, ITopicEx> = new Map()
    for (const [id, hash] of hashMap) {
      resultMap.set(id, toTopicEx(hash))
    }
    return resultMap
  }

  async findByIds (ids: number[] | Set<number>, userLevel?: UserLevel): Promise<ITopicEx[]> {
    const hashMap = await (
      userLevel ?
        this.redis.getFullHashListByIds([...ids], userLevel) :
        this.redis.getHashListByIds([...ids])
    )
    return [...hashMap.values()].map(hash => toTopicEx(hash))
  }

}
