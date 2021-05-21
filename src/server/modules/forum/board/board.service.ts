import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BoardDbService } from './board-db.service'
import { BoardRedisService } from './board-redis.service'
import { UserLevel } from '../../../../common/forum/forum.constants'
import { Sorting } from '../../../types'
import { IBoardEx } from '../../../../common/forum/forum.ex.interfaces'
import { toBoardEx } from '../../../common/utils/mapper-ex'
import { TopicService } from '../topic/topic.service'
import { MessageService } from '../message/message.service'


interface FindAllProps {
  userLevel: UserLevel
  orderBy?: 'default' | 'count-topic' | 'count-message'
  sorting?: Sorting
  withGroups?: boolean
  categoryId?: number
  parentId?: number
  level?: number
}

@Injectable()
export class BoardService {
  constructor (
    private readonly db: BoardDbService,
    private readonly redis: BoardRedisService,
    @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
  ) {
  }

  async findAll (props: FindAllProps): Promise<IBoardEx[]> {
    const {
      userLevel,
      orderBy = 'default',
      withGroups = false,
      categoryId = undefined,
      parentId = undefined,
      level = undefined
    } = props

    let sorting: Sorting = props.sorting === 'desc' ? 'desc' : 'asc'

    const resultList: IBoardEx[] = []
    let ids: number[] = []

    switch (orderBy) {
      case 'count-topic':
        ids = [...(await this.redis.getIdsCountTopics(userLevel, sorting)).keys()]
        break
      case 'count-message':
        ids = [...(await this.redis.getIdsCountMessage(userLevel, sorting)).keys()]
        break
      default:
        ids = await this.redis.getIds(userLevel, sorting)
        break
    }

    const hashMap = await this.redis.getFullHashListByIds(ids, userLevel)
    //todo

    for (const [id, hash] of hashMap) {
      const checkCategory = !categoryId || categoryId === hash.cat
      const checkParent = !parentId || parentId === hash.parent
      const checkLevel = level === undefined || level === hash.level

      if (checkCategory && checkParent && checkLevel) {
        const page = hash.lt_id && hash.lm_id ?
          (await this.messageService.getPageNumberInTopic({
            messageId: hash.lm_id,
            topicId: hash.lt_id,
            userLevel,
          })) :
          undefined
        resultList.push(toBoardEx(hash, withGroups, page))
      }
    }

    return resultList
  }

  async findByIdsToMap (ids: number[] | Set<number>, userLevel?: UserLevel): Promise<Map<number, IBoardEx>> {
    const hashMap = await (
      userLevel ?
        this.redis.getFullHashListByIds([...ids], userLevel) :
        this.redis.getHashListByIds([...ids])
    )
    const resultMap: Map<number, IBoardEx> = new Map()
    for (const [id, hash] of hashMap) {
      resultMap.set(id, toBoardEx(hash, false))
    }
    return resultMap
  }

  async findByIds (ids: number[] | Set<number>, userLevel?: UserLevel): Promise<IBoardEx[]> {
    const hashMap = await (
      userLevel ?
        this.redis.getFullHashListByIds([...ids], userLevel) :
        this.redis.getHashListByIds([...ids])
    )
    return [...hashMap.values()].map(hash => toBoardEx(hash, false))
  }
}
