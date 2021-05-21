import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { IBoard, IMessage, ITopic, IUser } from '../../../../common/forum/forum.base.interfaces'
import { ForumCacheService } from '../forum-cache/forum-cache.service'
import { getUserGroups } from '../../../../common/forum/utils'
import {
  BoardRelations,
  BoardRelationsArray,
  BoardRelationsRecord
} from '../../../../common/forum/forum.entity-relations'
import { uniqueArray } from '../../../../common/utils/array'
import { MessageDbService } from '../message/message-db.service'
import { CategoryService } from '../category/category.service'
import { BoardDynamicDataDto } from '../dto/board-dynamic-data.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { BoardEntity } from '../../../entities'
import { Not, In, Repository } from 'typeorm'
import { TopicDbService } from '../topic/topic-db.service'
import { UserDbService } from '../../user/user-db.service'
import { BoardsIgnored } from '../constants'



@Injectable()
export class BoardDbService {
  constructor (
    private readonly cacheService: ForumCacheService,
    @Inject(forwardRef(() => MessageDbService)) private readonly messageService: MessageDbService,
    @Inject(forwardRef(() => TopicDbService)) private readonly topicService: TopicDbService,
    @Inject(forwardRef(() => UserDbService)) private readonly userService: UserDbService,
    @Inject(forwardRef(() => CategoryService)) private readonly categoryService: CategoryService,
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
  ) {
  }

  async availableBoardIdsForUser (user?: IUser): Promise<number[]> {
    const userGroups = getUserGroups(user)
    const boards = await this.findAll(0, userGroups)
    return boards.map(board => board.id)
  }

  async findAll (parentId: number = 0, forGroups: number[] = [-1] /**todo**/): Promise<IBoard[]> {
    const boardMap = await this.cacheService.getBoardMap()
    const boardArray = [...boardMap.values()]

    return boardArray
      // .filter(board => board.linksId.parent === parentId)
      // .filter(board =>
      //   forGroups.length && board.settings.forGroups ?
      //     forGroups.some(g => board.settings.forGroups!.includes(g)) :
      //     true
      // )
  }


  async findOne (id: number): Promise<IBoard | undefined> {
    return (await this.cacheService.getBoardMap()).get(id)
  }


  async findByIdsToMap (ids: number[] | Set<number>): Promise<Map<number, IBoard>> {
    const idSet = new Set(ids)
    const boardMap = await this.cacheService.getBoardMap()

    return new Map<number, IBoard>(
      [...boardMap.entries()]
        .filter(([id]) => idSet.has(id))
    )
  }

  async findByIds (ids: number[] | Set<number>): Promise<IBoard[]> {
    return [...(await this.findByIdsToMap(ids)).values()]
  }

  async findByIdsToRecord (ids: number[] | Set<number>): Promise<Record<number, IBoard>> {
    const map = await this.findByIdsToMap(ids)
    return Object.fromEntries(map.entries())
  }

  async getRelations (
    items: IBoard[],
    withRelations: BoardRelationsArray = [],
  ): Promise<BoardRelationsRecord> {
    const relations = {} as BoardRelationsRecord

    if (withRelations.includes(BoardRelations.category)) {
      const boardIds = uniqueArray(items.map(item => item.linksId.category))
      relations[BoardRelations.category] = await this.categoryService.findByIdsToRecord(boardIds)
    }

    if (withRelations.includes(BoardRelations.lastTopic)) {
      //todo
    }

    if (withRelations.includes(BoardRelations.lastMessage)) {
      //todo
    }

    if (withRelations.includes(BoardRelations.lastMessage)) {
      //todo
      const ids = uniqueArray<number>(items.map(item => item.id))
      relations[BoardRelations.lastMessage] = await this.messageService.getLastMessageForBoardIds(ids)
    }

    return relations
  }

  async getDynamicData (_ids?: number[], withUser = false): Promise<Array<BoardDynamicDataDto>> {
    const ids = _ids && _ids.length > 0 ? _ids :
      (
        await this.boardRepository.find({
          select: ['idBoard'],
          where: {idBoard: Not(In(BoardsIgnored))}
        })
      ).map(b => b.idBoard)

    const data = await this.boardRepository.findByIds(ids)

    const messageIds: number[] = data.map(item => item.idLastMsg)
    const messageMap = await this.messageService.findByIdsToMap(messageIds)

    const topicIds: number[] = Object.values(messageMap).map(item => item.linksId.topic)
    const topicMap = await this.topicService.findByIdsToMap(topicIds)

    const userIds: number[] = withUser ? Object.values(messageMap).map(message => message.linksId.user) : []
    const userMap = withUser ? await this.userService.findByIdsToRecord(userIds) : {}

    return data.map(item => {
      const message: IMessage | undefined = messageMap[item.idLastMsg]
      const topic: ITopic | undefined = message ? topicMap.get(message.linksId.topic) : undefined
      const user: IUser | undefined = message ? userMap[message.linksId.user] : undefined

      return {
        id: item.idBoard,
        lastMessage: message,
        lastTopic: topic,
        lastUser: user,
        messages: item.numPosts,
        topics: item.numTopics,
      }
    })
  }
}
