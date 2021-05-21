import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
import {
  MessageRelations,
  MessageRelationsArray,
  MessageRelationsRecord
} from '../../../../common/forum/forum.entity-relations'
import { Equal, FindManyOptions, In, Not, Repository } from 'typeorm'
import { BoardEntity, MessageEntity, TopicEntity } from '../../../entities'
import { BoardsIgnored } from '../constants'
import { toMessage, toMessageMap } from '../../../common/utils/mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { UserDbService } from '../../user/user-db.service'
import { TopicDbService } from '../topic/topic-db.service'
import { BoardDbService } from '../board/board-db.service'
import { IMessage } from '../../../../common/forum/forum.base.interfaces'
import { mapToRecord, uniqueArray } from '../../../../common/utils/array'
import { FindConditions } from 'typeorm/find-options/FindConditions'
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'


@Injectable()
export class MessageDbService {

  constructor (
    @InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<TopicEntity>,
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
    @Inject(forwardRef(() => UserDbService)) private readonly userService: UserDbService,
    @Inject(forwardRef(() => BoardDbService)) private readonly boardDbService: BoardDbService,
    @Inject(forwardRef(() => TopicDbService)) private readonly topicService: TopicDbService,
  ) {
  }

  async findAll (options: {
    pagination: IPaginationOptions,
    boardIds?: number[],
    topicId?: number,
    sort?: 'ASC' | 'DESC',
  }): Promise<Pagination<IMessage>> {
    const where: FindConditions<MessageEntity> = {
      idBoard: options.boardIds ? (options.boardIds.length === 1 ? Equal(options.boardIds[0]) : In(options.boardIds)) : Not(In(BoardsIgnored)),
      approved: 1,
    }

    if (options.topicId) {
      where.idTopic = Equal(options.topicId)
    }

    const findOptions: FindManyOptions<MessageEntity> = {
      order: {
        idMsg: options.sort ?? 'ASC',
      },
      where,
    }

    const data = await paginate(this.messageRepository, options.pagination, findOptions)

    const messages = (data.items).map(toMessage)

    return {
      ...data,
      items: messages,
    }
  }


  async findByIds (ids: number[] | Set<number>): Promise<IMessage[]> {
    const data = await this.messageRepository.findByIds(uniqueArray(ids))
    return data.map(item => toMessage(item))
  }

  async findByIdsToMap (ids: number[] | Set<number>/*, compact = false*/): Promise<Record<number, IMessage>> {
    // noinspection ES6MissingAwait
    const promise = /*compact ?
        (this.messageRepository
          .createQueryBuilder('m')
          .select(['m.id_msg', 'm.modified_time', 'm.body', 'm.body_html'])
          .getMany()) :*/
      (this.messageRepository.findByIds(uniqueArray(ids)))

    const data = await promise
    return mapToRecord(toMessageMap(data))
  }

  async findById (id: number): Promise<IMessage | undefined> {
    const item = await this.messageRepository.findOne({ idMsg: id })
    return item ? toMessage(item) : undefined
  }


  async getRelations (
    messages: IMessage[],
    withRelations: MessageRelationsArray = []
  ): Promise<MessageRelationsRecord> {
    const relations = {} as MessageRelationsRecord

    if (withRelations.includes(MessageRelations.user)) {
      const userIds = uniqueArray(messages.map(message => message.linksId.user))
      relations[MessageRelations.user] = await this.userService.findByIdsToRecord(userIds)
    }

    if (withRelations.includes(MessageRelations.topic)) {
      const topicIds = uniqueArray(messages.map(messages => messages.linksId.topic))
      relations[MessageRelations.topic] = await this.topicService.findByIdsToRecord(topicIds)
    }

    if (withRelations.includes(MessageRelations.board)) {
      const boardIds = uniqueArray(messages.map(messages => messages.linksId.board))
      relations[MessageRelations.board] = await this.boardDbService.findByIdsToRecord(boardIds)
    }

    return relations
  }

  async getLastMessageForTopicIds (topicIds: number[]) {
    const record: Record<number, IMessage> = {}

    const rels: Array<{ topic: number, msg: number }> = await this.topicRepository
      .createQueryBuilder('t')
      .where({
        idTopic: In(topicIds),
      })
      .select('`t`.`id_topic` as `topic`, `t`.`id_last_msg` as `msg`')
      .getRawMany()

    const messages = await this.findByIdsToMap(rels.map(rel => rel.msg))

    for (const { msg, topic } of rels) {
      const message = messages[msg]
      if (message) {
        record[topic] = messages[msg]
      }
    }

    return record
  }

  async getLastMessageForBoardIds (boardIds: number[]) {
    const record: Record<number, IMessage> = {}

    const rels: Array<{ board: number, msg: number }> = await this.boardRepository
      .createQueryBuilder('b')
      .where({
        idBoard: In(boardIds),
      })
      .select('`b`.`id_board` as `board`, `b`.`id_last_msg` as `msg`')
      .getRawMany()

    const messages = await this.findByIdsToMap(rels.map(rel => rel.msg))

    for (const { msg, board } of rels) {
      const message = messages[msg]
      if (message) {
        record[board] = messages[msg]
      }
    }

    return record
  }
}
