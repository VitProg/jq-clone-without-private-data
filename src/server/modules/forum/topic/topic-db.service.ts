import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ITopic } from '../../../../common/forum/forum.base.interfaces'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageEntity, RelatedSubjectEntity, TopicEntity } from '../../../entities'
import { Equal, In, Not, Repository, SelectQueryBuilder } from 'typeorm'
import { toTopic, toTopicMap } from '../../../common/utils/mapper'
import { IForumTopicManyResponse } from '../../../../common/responses/forum.responses'
import { BoardsIgnored } from '../constants'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'
import { paginateRawAndEntities } from '../../../common/paginate/paginate-raw-and-entities'
import {
  MessageRelations,
  TopicRelations,
  TopicRelationsArray,
  TopicRelationsRecord
} from '../../../../common/forum/forum.entity-relations'
import { BoardDbService } from '../board/board-db.service'
import { CategoryService } from '../category/category.service'
import { uniqueArray } from '../../../../common/utils/array'
import { MessageDbService } from '../message/message-db.service'
import { UserDbService } from '../../user/user-db.service'
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'


@Injectable()
export class TopicDbService {
  constructor (
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<TopicEntity>,
    @Inject(forwardRef(() => BoardDbService)) private readonly boardService: BoardDbService,
    @Inject(forwardRef(() => CategoryService)) private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => MessageDbService)) private readonly messageService: MessageDbService,
    @Inject(forwardRef(() => UserDbService)) private readonly userService: UserDbService,
  ) {
  }

  private query (): SelectQueryBuilder<TopicEntity> {
    return this.topicRepository
      .createQueryBuilder()
      .leftJoin(RelatedSubjectEntity, 'rs', `rs.id_topic = ${TopicEntity.name}.id_topic`)
      .leftJoin(MessageEntity, 'fm', `rs.subject IS NULL AND fm.id_msg = ${TopicEntity.name}.id_first_msg`)
      .addSelect('IF(fm.subject IS NULL, rs.subject, fm.subject) as `subject`')
  }

  private rawToItem (entity?: TopicEntity, raw?: any) {
    if (!entity) {
      return undefined
    }
    return toTopic({
      ...entity,
      subject: raw?.subject,
    })
  }

  private rawToArray (data: { entities: TopicEntity[], raw: any[] }) {
    return data.entities.map((value: any, index: number) => ({
      ...value,
      subject: data.raw[index]?.subject,
    })).map(m => toTopic(m))
  }

  private rawToMap (data: { entities: TopicEntity[], raw: any[] }) {
    return toTopicMap(data.entities.map((value: any, index: number) => ({
      ...value,
      subject: data.raw[index]?.subject,
    })))
  }


  async findAll (
    options: {
      boardIds?: number[],
      withUnApproved?: boolean,
    }
  ): Promise<ITopic[]> {
    let idBoard = options.boardIds ? In(options.boardIds) : Not(In(BoardsIgnored))

    const query = this.query()
      .where({
        idBoard,
        ...(options.withUnApproved ? {} : { approved: 1 }),
      })
      .orderBy({
        'id_last_msg': 'DESC', //todo подумать как о этого избавится
      })

    const data = await query.getRawAndEntities()

    return this.rawToArray(data)
  }

  async paginate (
    options: {
      pagination: IPaginationOptions,
      boardId?: number,
      boardIds?: number[],
      withUnApproved?: boolean,
      stickyFirst?: boolean
    }
  ): Promise<Pagination<ITopic>> {
    let idBoard = options.boardIds ? In(options.boardIds) : Not(In(BoardsIgnored))
    if (options.boardId) {
      idBoard = Equal(options.boardId)
    }

    const query = this.query()
      .where({
        idBoard,
        ...(options.withUnApproved ? {} : { approved: 1 }),
      })

    if (options.stickyFirst) {
      query.orderBy({
        'is_sticky': 'DESC',
        'id_last_msg': 'DESC'
      })
    } else {
      query.orderBy({
        'id_last_msg': 'DESC',
      })
    }

    return await paginateRawAndEntities(
      query,
      options.pagination,
      (entities, raw) => this.rawToArray({ entities, raw })
    )
  }

  async findByIdsToMap (ids: number[] | Set<number>): Promise<Map<number, ITopic>> {
    const data = await this.query()
      .whereInIds(uniqueArray(ids))
      .getRawAndEntities()
    return this.rawToMap(data)
  }

  async findByIds (ids: number[] | Set<number>): Promise<ITopic[]> {
    const data = await this.query()
      .whereInIds(uniqueArray(ids))
      .getRawAndEntities()
    return this.rawToArray(data)
  }

  async findById (id: number): Promise<ITopic | undefined> {
    const data = await this.query()
      .where({
        idTopic: id,
      })
      .getRawAndEntities()
    return this.rawToItem(data.entities[0], data.raw[0])
  }

  async findByIdsToRecord (ids: number[] | Set<number>): Promise<Record<number, ITopic>> {
    const map = await this.findByIdsToMap(ids)
    return Object.fromEntries(map.entries())
  }

  async getRelations (
    topics: ITopic[],
    withRelations: TopicRelationsArray = []
  ): Promise<TopicRelationsRecord> {
    const relations = {} as TopicRelationsRecord

    if (withRelations.includes(TopicRelations.board)) {
      const boardIds = uniqueArray(topics.map(messages => messages.linksId.board))
      relations[TopicRelations.board] = await this.boardService.findByIdsToRecord(boardIds)

      if (withRelations.includes(TopicRelations.category)) {
        const categoryIds = uniqueArray(Object.values(relations[MessageRelations.board]!).map(board => board.linksId.category))
        relations[TopicRelations.category] = await this.categoryService.findByIdsToRecord(categoryIds)
      }
    }

    if (withRelations.includes(TopicRelations.lastMessage) || withRelations.includes(TopicRelations.lastUser)) {
      const topicIds = uniqueArray<number>(topics.map(topic => topic.id))
      relations[TopicRelations.lastMessage] = await this.messageService.getLastMessageForTopicIds(topicIds)
    }

    if (withRelations.includes(TopicRelations.lastUser) && relations[TopicRelations.lastMessage]) {
      const userIds = uniqueArray<number>(Object.values(relations[TopicRelations.lastMessage]!).map(message => message.linksId.user))
      relations[TopicRelations.lastUser] = await this.userService.findByIdsToRecord(userIds)

      if (!withRelations.includes(TopicRelations.lastMessage)) {
        delete relations[TopicRelations.lastMessage]
      }
    }

    return relations
  }

}
