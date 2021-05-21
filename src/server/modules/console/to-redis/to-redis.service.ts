import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BoardEntity, CategoryEntity, MemberEntity, MessageEntity, TopicEntity } from '../../../entities'
import { In, Not, Repository } from 'typeorm'
import { ConsoleService } from 'nestjs-console'
import { REDIS_CLIENT } from '../../../di.symbols'
import { RedisClient } from '../../../types'
import { Gender, UserLevel, userLevelsGroupIds } from '../../../../common/forum/forum.constants'
import { getUserLevel, getUserLevelsByGroups, getUserName } from '../../../../common/forum/utils'
import { toBoardMap, toCategoryMap } from '../../../common/utils/mapper'
import * as KEY from '../../../common/utils/redis'
import {
  boardKeyPrefixes, boardNumsKeyPrefixes, getKeyBoardStatHash, messageKeyPrefixes, PINNED_POST_FACTOR,
  RedisBoardHash,
  RedisBoardStatHash,
  RedisMessageHash,
  RedisTopicHash,
  RedisTopicHash_OnlyAuthor,
  RedisTopicStatHash,
  RedisUserHash,
  topicKeyPrefixes, topicNumsKeyPrefixes,
  toRedisBoardStatHash,
  toRedisMessageHash,
  toRedisTopicStatHash,
  toRedisUserHash,
  userKeyPrefixes,
  zResultWithScoresToMap,
  zResultWithScoresToSum
} from '../../../common/utils/redis'
import { IBoard, ICategory, IMessage, ITopic, IUser } from '../../../../common/forum/forum.base.interfaces'
import { BoardsIgnored } from '../../forum/constants'
import { TopicDbService } from '../../forum/topic/topic-db.service'
import { UserDbService } from '../../user/user-db.service'
import { BoardDbService } from '../../forum/board/board-db.service'
import { percentStr, toInt } from '../../../../common/utils/number'
import { isArray } from '../../../../common/type-guards'


const MAX_LATEST_MESSAGES = 500
const MAX_LATEST_TOPICS = 500

const timeToScore = (time: number, order: 'asc' | 'desc' = 'asc'): any => {
  if (order === 'asc') {
    return time - 1000000000
  } else {
    return -1 * (time - 1000000000)
  }
}

const numberToScore = (id: number, order: 'asc' | 'desc' = 'asc'): any => {
  if (order === 'asc') {
    return id
  } else {
    return -1 * id
  }
}

type Part = 'clear' | 'user' | 'message' | 'board' | 'topic' | 'topic-counter' | 'board-counter'

@Injectable()
export class ToRedisService {
  constructor (
    private readonly consoleService: ConsoleService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
    @InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<TopicEntity>,
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(MemberEntity) private readonly memberRepository: Repository<MemberEntity>,
    @Inject(forwardRef(() => UserDbService)) private readonly userService: UserDbService,
    @Inject(forwardRef(() => BoardDbService)) private readonly boardService: BoardDbService,
    // @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
    @Inject(forwardRef(() => TopicDbService)) private readonly topicService: TopicDbService,
  ) {
    const cli = this.consoleService.getCli()

    const groupCommand = this.consoleService.createGroupCommand(
      {
        name: 'to-redis',
        description: 'Migrate some data to redis'
      },
      cli,
    )

    const convertGroup = this.consoleService.createGroupCommand({
      name: 'convert',
      description: 'Convert DB from MySQL to Redis',
    }, groupCommand)


    this.consoleService.createCommand(
      {
        command: 'all',
        description: 'all steps'
      },
      () => this.convert(),
      convertGroup // attach the command to the group
    )

    this.consoleService.createCommand(
      {
        command: 'clear',
        description: 'clear redis DB'
      },
      () => this.convert(['clear']),
      convertGroup // attach the command to the group
    )

    this.consoleService.createCommand(
      {
        command: 'user',
        description: 'convert data about users'
      },
      () => this.convert(['user']),
      convertGroup // attach the command to the group
    )

    this.consoleService.createCommand(
      {
        command: 'message',
        description: 'convert data about messages'
      },
      () => this.convert(['message']),
      convertGroup // attach the command to the group
    )

    this.consoleService.createCommand(
      {
        command: 'board',
        description: 'convert data about boards'
      },
      () => this.convert(['board']),
      convertGroup // attach the command to the group
    )

    this.consoleService.createCommand(
      {
        command: 'topic',
        description: 'convert data about topics'
      },
      () => this.convert(['topic']),
      convertGroup // attach the command to the group
    )

    this.consoleService.createCommand(
      {
        command: 'topic-counter',
        description: 'convert data about topics counters'
      },
      () => this.convert(['topic-counter']),
      convertGroup // attach the command to the group
    )

    this.consoleService.createCommand(
      {
        command: 'board-counter',
        description: 'convert data about boards counters'
      },
      () => this.convert(['board-counter']),
      convertGroup // attach the command to the group
    )
  }

  private _boardsMap: Map<number, IBoard> | undefined
  private _boards: BoardEntity[] | undefined

  private async getBoardMap () {
    if (!this._boardsMap) {
      this._boards = await this.boardRepository.find({ where: { idBoard: Not(In(BoardsIgnored)) } })
      this._boardsMap = toBoardMap(this._boards)
    }
    return this._boardsMap
  }

  private _categoryMap: Map<number, ICategory> | undefined
  private _categories: CategoryEntity[] | undefined

  private async getCategoryMap () {
    if (!this._categoryMap) {
      this._categories = await this.categoryRepository.find()
      this._categoryMap = toCategoryMap(this._categories)
    }
    return this._categoryMap
  }

  private async getBoards () {
    if (!this._boards) {
      this._boards = await this.boardRepository.find({ where: { idBoard: Not(In(BoardsIgnored)) } })
      this._boardsMap = toBoardMap(this._boards)
    }
    return this._boards
  }

  private async loadTopics () {
    const topics = await this.topicService.findAll({ withUnApproved: true })
    const topicMap: Map<number, ITopic> = new Map()
    for (const topic of topics) {
      topicMap.set(topic.id, topic)
    }
    return topicMap
  }

  private _topicsMap: Map<number, ITopic> | undefined

  private async getTopicMap (ids?: number[]) {
    if (!this._topicsMap) {
      this._topicsMap = await this.loadTopics()
    }
    if (ids) {
      return new Map(
        [...this._topicsMap.entries()].filter(([id]) => ids.includes(id))
      )
    } else {
      return this._topicsMap
    }
  }

  private _userMap: Map<number, IUser> | undefined

  private async getUserMap (ids?: number[]) {
    if (!this._userMap) {
      this._userMap = await this.userService.findAllToMap([], true)
    }
    if (ids) {
      return new Map(
        [...this._userMap.entries()].filter(([id]) => ids.includes(id))
      )
    } else {
      return this._userMap
    }
  }


  convert = async (parts?: Part[]) => {
    const beginTime = Date.now()
    try {
      const inProcess = (await this.redis.get('converting-db')) !== null
      if (inProcess) {
        console.error('Another converting process is running, please wait or delete redis key "converting-db"')
      }
      console.log(await this.redis.pipeline()
        .set('db-converted', 0)
        .set('converting-db', 1)
        .exec())

      console.log('convert DB to redis')
      console.log(await this.redis.dbsize())

      const check = (need: Part) => !parts || parts.includes(need)

      const withTime = async (need: Part, run: () => void) => {
        if (!check(need)) {
          return
        }
        let time = Date.now()
        await run()
        console.log((((Date.now() - time) / 1000)).toFixed(3), 'sec', '\n\n')
      }

      let needClearSingle = parts && parts.length === 1

      await withTime('clear', () => this.clearRedisDB())
      await withTime('user', () => this.convertUsers(needClearSingle))
      await withTime('message', () => this.convertMessage(needClearSingle))
      await withTime('board', () => this.convertBoard(needClearSingle))
      await withTime('topic', () => this.convertTopics(needClearSingle))
      await withTime('topic-counter', () => this.convertTopicCounters(needClearSingle))
      await withTime('board-counter', () => this.convertBoardCounters(needClearSingle))

      console.log('completed!')
    } catch (e) {
      console.error(e)
    } finally {
      await this.redis.pipeline()
        .del('converting-db')
        .set('db-converted', 1)
        .exec()
      const endTime = Date.now()
      console.log((((endTime - beginTime) / 1000) / 60).toFixed(3), 'minutes')
      console.log('DB size:', await this.redis.dbsize())
    }

  }

  private async clearRedisDB (pattern?: string | string[]) {
    if (isArray(pattern)) {
      for (const p of pattern) {
        await this.clearRedisDB(p)
      }
      return
    }

    console.log('clear redis db', pattern ?? '')
    const prefix = process.env.REDIS_PREFIX ?? ''
    const keys = (await this.redis.keys(`${prefix}${pattern ?? ''}*`))
      .map(k => k.substr(prefix.length))

    while (true) {
      const del = keys.splice(0, 5000)
      if (!del || del.length <= 0) {
        break
      }
      await this.redis.del(del)
    }
  }

  private async convertBoard (clearData = false) {
    // if (clearData) {
    //   await this.clearRedisDB(boardKeyPrefixes.filter(i => !i.startsWith('h:')))
    // }
    console.log('convert boards')
    const boardsMap = await this.getBoardMap()
    const boardsArray = [...boardsMap.values()]
    const categoryMap = await this.getCategoryMap()

    // const messageIds: Set<number> = new Set()
    // const userIds: Set<number> = new Set()

    const boardStatHashMap: Map<string, RedisBoardStatHash> = new Map()
    const toBoardStatHashMapKey = (boardId: number, level: UserLevel) => `${boardId}:${level}`
    for (const board of boardsArray) {
      const levels = getAvailableUserLevels(board.settings.forGroups)
      for (const level of levels) {
        const key = toBoardStatHashMapKey(board.id, level)
        const hash = toRedisBoardStatHash(await this.redis.hgetall(KEY.getKeyBoardStatHash(board.id, level)))
        boardStatHashMap.set(key, hash)
        // if (hash.lm_id) {
        //   messageIds.add(hash.lm_id)
        // }
      }
    }

    // const messageHashMap: Map<number, RedisMessageHash> = new Map()
    // for (const messageId of messageIds) {
    //   const hash = toRedisMessageHash(await this.redis.hgetall(KEY.getKeyMessageHash(messageId)))
    //   messageHashMap.set(messageId, hash)
    //   if (hash.user) {
    //     userIds.add(hash.user)
    //   }
    // }

    // const userHashMap: Map<number, RedisUserHash> = new Map()
    // for (const userId of userIds) {
    //   const hash = toRedisUserHash(await this.redis.hgetall(KEY.getKeyUserHash(userId)))
    //   if (hash) {
    //     userHashMap.set(userId, hash)
    //   }
    // }

    for (const [id, board] of boardsMap) {
      const levels = getAvailableUserLevels(board.settings.forGroups)

      const pipeline = this.redis.pipeline()

      const keyHash = KEY.getKeyBoardHash(id)
      const hash: RedisBoardHash = {
        id,
        name: board.name,
        url: board.url,
        desc: board.description,
        groups: (board.settings.forGroups ?? [-1, 0]).sort((a, b) => a - b).join(','),
        level: board.settings.level,
        parent: board.linksId.parent,
        cat: board.linksId.category,
        cat_name: categoryMap.get(board.linksId.category)?.name ?? '',
      }
      await pipeline.hset(keyHash, hash)

      for (const level of levels) {
        const keyStatHash = getKeyBoardStatHash(id, level)
        const statHash = boardStatHashMap.get(toBoardStatHashMapKey(id, level)) ?? toRedisBoardStatHash(board as any)
        // const lastMessageHash = statHash ? messageHashMap.get(statHash.lm_id) : undefined

        const keyOrdered = KEY.getKeyBoardOrderedLevel(level)
        // const keyLastTopic = KEY.getKeyBoardLastTopicLevel(level)
        // const keyLastMessage = KEY.getKeyBoardLastMessageLevel(level)

        await pipeline.zadd(keyOrdered, board.settings.order + '', id + '')
        await pipeline.hset(keyStatHash, statHash)

        // if (lastMessageHash) {
          // await pipeline.zadd(keyLastTopic, numberToScore(lastMessageHash.topic, 'asc') + '', id + '')
          // await pipeline.zadd(keyLastMessage, numberToScore(lastMessageHash.id, 'asc') + '', id + '')
        // }
      }
      await pipeline.exec()
    }
  }

  private async convertTopics (clearData = false) {
    if (clearData) {
      await this.clearRedisDB(topicKeyPrefixes.filter(i => !i.startsWith('h:')))
    }
    console.log('convert topics')

    const boardsMap = await this.getBoardMap()
    const topicMap = await this.getTopicMap()
    const topicArray = [...topicMap.values()]

    let countLatestTopics: Record<UserLevel, number> = {} as any
    for (const userLevel of getAvailableUserLevels('all')) {
      countLatestTopics[userLevel] = 0
    }

    const messageIds: Set<number> = new Set()
    const userIds: Set<number> = new Set()

    const topicStatHashMap: Map<string, RedisTopicStatHash> = new Map()
    const toTopicStatHashMapKey = (topicId: number, level: UserLevel) => `${topicId}:${level}`
    for (const topic of topicArray) {
      for (const level of getAvailableUserLevels('all')) {
        const key = toTopicStatHashMapKey(topic.id, level)
        const hash = toRedisTopicStatHash(await this.redis.hgetall(KEY.getKeyTopicStatHash(topic.id, level)))
        topicStatHashMap.set(key, hash)
        if (hash.lm_id) {
          messageIds.add(hash.lm_id)
        }
      }
    }

    const messageHashMap: Map<number, RedisMessageHash> = new Map()
    for (const messageId of messageIds) {
      const hash = toRedisMessageHash(await this.redis.hgetall(KEY.getKeyMessageHash(messageId)))
      messageHashMap.set(messageId, hash)
      if (hash.user) {
        userIds.add(hash.user)
      }
    }

    const userHashMap: Map<number, RedisUserHash> = new Map()
    for (const userId of userIds) {
      const hash = toRedisUserHash(await this.redis.hgetall(KEY.getKeyUserHash(userId)))
      if (hash) {
        userHashMap.set(userId, hash)
      }
    }


    for (const [id, topic] of topicMap) {
      const isApproved = topic.flags.isApproved
      const isPinned = topic.flags.isSticky
      const isPinnedFirstMessage = topic.flags.isStickyFirstPost

      const boardModel = boardsMap.get(topic.linksId.board)
      if (!boardModel) {
        if (topic.linksId.board > 0) {
          throw new Error(`board ${topic.linksId.board} not found, for topic ${id}`)
        }
        continue
      }

      const levels = getAvailableUserLevels(boardModel.settings.forGroups)

      const pipeline = this.redis.pipeline()

      const keyHash = KEY.getKeyTopicHash(id)
      const hash: Partial<RedisTopicHash> = {
        id,
        subject: topic.subject,
        url: topic.url,
        approved: isApproved ? 1 : 0,
        pinned: isPinned ? 1 : 0,
        pinned_fm: isPinnedFirstMessage ? 1 : 0,
        board: boardModel.id,
      }
      await pipeline.hset(keyHash, hash)

      // const sortASC: any = numberToScore(topic.linksId.lastMessage)

      for (const level of levels) {
        if (isApproved || (!isApproved && [UserLevel.admin, UserLevel.moderator].includes(level))) {
          const hashStat = topicStatHashMap.get(toTopicStatHashMapKey(id, level))
          const lastMessageHash = hashStat ? messageHashMap.get(hashStat.lm_id) : undefined

          const keyBoard = KEY.getKeyTopicBoardLevel(topic.linksId.board, level)
          const keyLatest = KEY.getKeyTopicLatestLevel(level)
          const keyStatHash = KEY.getKeyTopicStatHash(id, level)

          pipeline.hset(keyStatHash, hash)

          const sortPart = lastMessageHash?.id ?? 0
          const sort = numberToScore(isPinned ? PINNED_POST_FACTOR + sortPart : sortPart)

          pipeline.zadd(keyBoard, sort, id + '')

          if (countLatestTopics[level] < MAX_LATEST_TOPICS) {
            pipeline.zadd(keyLatest, sort, id + '')
            countLatestTopics[level]++
          }
        }
      }
      await pipeline.exec()
    }
  }

  private async convertMessage (clearData = false) {
    if (clearData) {
      await this.clearRedisDB(messageKeyPrefixes)
    }
    console.log('convert messages')

    const boardMap = await this.getBoardMap()
    const topicMap = await this.getTopicMap()

    let countLatestMessages = 0
    const PER_TURN = 10000
    let messages: MessageEntity[] = []
    let skip = 0
    const messagesCount = await this.messageRepository.count({
      where: {
        idBoard: Not(In(BoardsIgnored))
      },
    })
    const messagesCountAll = await this.messageRepository.count()

    console.log('...ignored: ', messagesCountAll - messagesCount)

    const userHashMap: Map<number, RedisUserHash> = new Map()

    while (true) {
      console.log('...load messages', percentStr(skip, messagesCount), skip, PER_TURN, messagesCount)

      messages = await this.messageRepository.find({
        where: {
          idBoard: Not(In(BoardsIgnored)),
          // idTopic: 4475,
        },
        order: {
          idMsg: 'DESC'
        },
        skip,
        take: PER_TURN,
      })
      skip += PER_TURN
      if (!messages || messages.length === 0) {
        break
      }

      const userIds: Set<number> = new Set()
      for (const message of messages) {
        userIds.add(message.idMember)
      }

      for (const userId of userIds) {
        if (!userHashMap.has(userId)) {
          const hash = toRedisUserHash(await this.redis.hgetall(KEY.getKeyUserHash(userId)))
          if (hash) {
            userHashMap.set(userId, hash)
          }
        }
      }
      userIds.clear()

      for (const message of messages) {
        const topicModel = topicMap.get(message.idTopic)!
        if (!topicModel) {
          if (message.idTopic > 0) {
            throw new Error(`topic ${message.idTopic} not found, for message ${message.idMsg}`)
          }
          continue
        }

        const boardModel = boardMap.get(message.idBoard)!
        if (!boardModel) {
          if (message.idBoard > 0) {
            throw new Error(`board ${message.idBoard} not found, for message ${message.idMsg}`)
          }
          continue
        }

        // const userHash = toRedisUserHash(await this.redis.hgetall(KEY.getKeyUserHash(message.idMember)))
        const userHash = userHashMap.get(message.idMember)

        const isApproved = !!message.approved && topicModel.flags.isApproved

        const id: any = message.idMsg
        const sort: any = numberToScore(message.idMsg)

        const levels = getAvailableUserLevels(boardModel.settings.forGroups)

        const pipeline = this.redis.pipeline()

        const hash: RedisMessageHash = {
          id,
          date: message.posterTime,
          board: message.idBoard,
          topic: message.idTopic,
          user: message.idMember,
          rate_p: message.nRateGood,
          rate_m: message.nRateBad,
          approved: message.approved ? 1 : 0,
        }

        const keyHash = KEY.getKeyMessageHash(id)
        pipeline.hset(keyHash, hash)

        for (const level of levels) {
          if (isApproved || (!isApproved && [UserLevel.admin, UserLevel.moderator].includes(level))) {
            const keyLatest = KEY.getKeyMessageLatestLevel(level)
            // const keyBoard = KEY.getKeyMessageBoardLevel(topicModel.id, level)
            const keyTopic = KEY.getKeyMessageTopicLevel(topicModel.id, level)

            // pipeline.zadd(keyBoard, sortASC, id)
            pipeline.zadd(keyTopic, sort, id)

            if (countLatestMessages < MAX_LATEST_MESSAGES) {
              countLatestMessages++
              pipeline.zadd(keyLatest, sort, id)
            }

            const keyBoardShatHash = KEY.getKeyBoardStatHash(message.idBoard, level)
            const boardLastMessageId = toInt(await this.redis.hget(keyBoardShatHash, 'lm_id'))
            if (!boardLastMessageId || message.idMsg > boardLastMessageId) {
              pipeline.hset(keyBoardShatHash, {
                  id: message.idBoard,
                  lt_id: topicModel?.id ?? 0,
                  lt_url: topicModel?.url ?? '',
                  lt_subject: topicModel?.subject ?? '',
                  lm_id: message.idMsg,
                  lm_date: message.posterTime,
                  lu_id: userHash?.id ?? 0,
                  lu_url: userHash?.url ?? '',
                  lu_name: userHash?.name ?? ''
                } as Partial<RedisBoardStatHash>
              )
            }

            const keyTopicHash = KEY.getKeyTopicHash(message.idTopic)
            const topicFirstMessageId = toInt(await this.redis.hget(keyTopicHash, 'fm_id'))
            if (!topicFirstMessageId || message.idMsg < topicFirstMessageId) {
              pipeline.hset(keyTopicHash, {
                  id: message.idTopic,
                  date: message.posterTime,
                  au_id: message.idMember,
                } as Partial<RedisTopicHash>
              )
            }

            const keyTopicShatHash = KEY.getKeyTopicStatHash(message.idTopic, level)
            const topicLastMessageId = toInt(await this.redis.hget(keyTopicShatHash, 'lm_id'))
            if (message.idTopic > topicLastMessageId) {
              pipeline.hset(keyTopicShatHash, {
                  id: message.idBoard,
                  lm_id: message.idMsg,
                  lm_date: message.posterTime,
                  lu_id: userHash?.id ?? 0,
                  lu_url: userHash?.url ?? '',
                  lu_name: userHash?.name ?? ''
                } as Partial<RedisTopicStatHash>
              )
            }
          }
        }
        await pipeline.exec()
      }
    }
  }


  private async convertUsers (clearData = false) {
    if (clearData) {
      await this.clearRedisDB(userKeyPrefixes)
    }
    console.log('convert users')

    const userMap = await this.getUserMap()

    const _numTopicsEntries: Array<[number, number]> = (await this.topicRepository
        .createQueryBuilder('t')
        .select('t.id_member_started as id, count(*) as num')
        .where('t.id_member_started > 0 and t.id_board not in (:ids)', { ids: BoardsIgnored })
        .groupBy('t.id_member_started')
        .getRawMany<{ id: number, num: string }>()
    ).map(item => ([item.id, toInt(item.num)]))
    const numTopicsMap: Map<number, number> = new Map(_numTopicsEntries)

    const _numMessagesEntries: Array<[number, number]> = (await this.messageRepository
        .createQueryBuilder('m')
        .select('m.id_member as id, count(*) as num')
        .where('m.id_member > 0 and m.id_board not in (:ids)', { ids: BoardsIgnored })
        .groupBy('m.id_member')
        .getRawMany<{ id: number, num: string }>()
    ).map(item => ([item.id, toInt(item.num)]))
    const numMessagesMap: Map<number, number> = new Map(_numMessagesEntries)

    const count = userMap.size
    let index = 0

    for (const [id, user] of userMap) {
      if (index === 0 || index % 1000 === 0) {
        console.log('...', percentStr(index, count), index, count)
      }
      const userName = getUserName(user, false)

      const keyHash = KEY.getKeyUserHash(id)
      const keyHashNameToId = userName ? KEY.getKeyUserHashNameToId() : undefined

      const hash: RedisUserHash = {
        id,
        name: userName,
        url: user.url,
        gender: toSimpleGender(user.gender),
        groups: user.settings.groupIds.join(','),
        level: getUserLevel(user),
        avatar: user.avatar,
        r_date: dateToNumber(user.dates.registered),
        l_date: dateToNumber(user.dates.lastLogin),
        karma_p: user.statistics.karmaPlus,
        karma_m: user.statistics.karmaMinus,
        nt: numTopicsMap.get(user.id) ?? 0,
        nm: numMessagesMap.get(user.id) ?? 0,
        ls_global: user?.__raw?.idMsgLastVisit ?? 0,
        activated: user?.flags.isActivated ? 1 : 0,
      }

      await this.redis.hset(keyHash, hash)

      if (userName && keyHashNameToId) {
        const lower = userName.toLowerCase()
        await this.redis.hset(keyHashNameToId, lower, id)
        if (lower !== userName) {
          await this.redis.hset(keyHashNameToId, userName, id)
        }
      }

      index++
    }
    console.log('...', '100%')

    numTopicsMap.clear()
    numMessagesMap.clear()
    //todo
  }


  private async convertTopicCounters (clearData = false) {
    if (clearData) {
      await this.clearRedisDB(topicNumsKeyPrefixes)
    }
    console.log('convert topic counters')

    const topicMap = await this.getTopicMap()
    const boardMap = await this.getBoardMap()
    // const userMap = await this.getUserMap()

    const count = topicMap.size
    let index = 0

    /////
    const messageIds: Set<number> = new Set()
    const userIds: Set<number> = new Set()


    const levelToLastMessageId: Partial<Record<string, number>> = {}
    const getLevelToLastMessageIdKey = (topicId: number, level: UserLevel | string) => `${topicId}:${level}`
    for (const [id, topic] of topicMap) {
      const firstMessageId = firstInt(await this.redis.zrange(KEY.getKeyMessageTopicLevel(id, UserLevel.admin), 0, 1))
      messageIds.add(firstMessageId)
      for (const level of getAvailableUserLevels('all')) {
        if (topic.flags.isApproved || (!topic.flags.isApproved && [UserLevel.admin, UserLevel.moderator].includes(level))) {
          const keyMessages = KEY.getKeyMessageTopicLevel(id, level)
          const lastMessageId = firstInt(await this.redis.zrevrange(keyMessages, 0, 1))
          messageIds.add(lastMessageId)
          const key = getLevelToLastMessageIdKey(topic.id, level)
          levelToLastMessageId[key] = lastMessageId
        }
      }
    }

    const messageHashMap: Map<number, RedisMessageHash> = new Map()
    for (const messageId of messageIds) {
      const hash = toRedisMessageHash(await this.redis.hgetall(KEY.getKeyMessageHash(messageId)))
      messageHashMap.set(messageId, hash)
      if (hash.user) {
        userIds.add(hash.user)
      }
    }

    const userHashMap: Map<number, RedisUserHash> = new Map()
    for (const userId of userIds) {
      const hash = toRedisUserHash(await this.redis.hgetall(KEY.getKeyUserHash(userId)))
      if (hash) {
        userHashMap.set(userId, hash)
      }
    }

    messageIds.clear()
    userIds.clear()

    ////

    for (const [id, topic] of topicMap) {
      if (index === 0 || index % 1000 === 0) {
        console.log('...', percentStr(index, count), index, count)
      }

      const boardModel = boardMap.get(topic.linksId.board)!
      if (!boardModel) {
        if (topic.linksId.board > 0) {
          throw new Error(`board ${topic.linksId.board} not found, for topic ${id}`)
        }
        continue
      }
      const pipeline = this.redis.pipeline()

      const isApproved = topic.flags.isApproved

      const keyHash = KEY.getKeyTopicHash(id)


      const levels = getAvailableUserLevels(boardModel.settings.forGroups)

      const firstMessageId = firstInt(await this.redis.zrange(KEY.getKeyMessageTopicLevel(id, UserLevel.admin), 0, 1))

      /////

      const firstMessage = messageHashMap.get(firstMessageId)
      const authorUser = userHashMap.get(firstMessage?.user ?? 0)
      pipeline.hset(keyHash, {
        date: firstMessage?.date,
        au_id: authorUser?.id ?? 0,
        au_url: authorUser?.url ?? '',
        au_name: getUserName(authorUser, false)
      } as RedisTopicHash_OnlyAuthor)
      ///

      for (const level of levels) {
        if (isApproved || (!isApproved && [UserLevel.admin, UserLevel.moderator].includes(level))) {
          const keyMessages = KEY.getKeyMessageTopicLevel(id, level)
          const keyStatHash = KEY.getKeyTopicStatHash(id, level)

          const countMessages = await this.redis.zcard(keyMessages)

          const lastMessageIdKey = getLevelToLastMessageIdKey(topic.id, level)
          const lastMessageId = levelToLastMessageId[lastMessageIdKey] ?? 0
          const lastMessage = messageHashMap.get(lastMessageId)
          const lastUser = userHashMap.get(lastMessage?.user ?? 0)

          const sortASC: any = numberToScore(countMessages, 'asc')

          const hash: RedisTopicStatHash = {
            id,
            lm_id: lastMessage?.id ?? 0,
            lm_date: lastMessage?.date ?? 0,
            lu_id: lastUser?.id ?? 0,
            lu_name: lastUser?.name ?? '',
            lu_url: lastUser?.url ?? '',
            nm: countMessages,
          }

          pipeline.hset(keyStatHash, hash)

          const keyNumMessages = KEY.getKeyTopicBoardNumMessagesLevel(boardModel.id, level)
          pipeline.zadd(keyNumMessages, sortASC, id + '')
        }
      }
      await pipeline.exec()
      index++
    }
    console.log('...', '100%')
  }

  private async convertBoardCounters (clearData = false) {
    if (clearData) {
      await this.clearRedisDB(boardNumsKeyPrefixes)
    }
    console.log('convert board counters')

    const boardMap = await this.getBoardMap()
    const topicMap = await this.getTopicMap()

    const count = boardMap.size
    let index = 0

    /////
    const messageIds: Set<number> = new Set()
    const userIds: Set<number> = new Set()


    const levelToLastMessageId: Partial<Record<string, number>> = {}
    const getLevelToLastMessageIdKey = (boardId: number, level: UserLevel | string) => `${boardId}:${level}`
    for (const [id, board] of boardMap) {
      const levels = getAvailableUserLevels(board.settings.forGroups)
      for (const level of levels) {
        const keyTopicBoard = KEY.getKeyTopicBoardLevel(id, level)
        const lastTopicId = firstInt(await this.redis.zrevrange(keyTopicBoard, 0, 1))
        const lastMessageId = lastTopicId ? firstInt(await this.redis.zrevrange(KEY.getKeyMessageTopicLevel(lastTopicId, level), 0, 1)) : 0
        messageIds.add(lastMessageId)
        levelToLastMessageId[`${board.id}:${level}`] = lastMessageId
      }
    }

    const messageHashMap: Map<number, RedisMessageHash> = new Map()
    for (const messageId of messageIds) {
      const hash = toRedisMessageHash(await this.redis.hgetall(KEY.getKeyMessageHash(messageId)))
      messageHashMap.set(messageId, hash)
      if (hash.user) {
        userIds.add(hash.user)
      }
    }

    const userHashMap: Map<number, RedisUserHash> = new Map()
    for (const userId of userIds) {
      const hash = toRedisUserHash(await this.redis.hgetall(KEY.getKeyUserHash(userId)))
      if (hash) {
        userHashMap.set(userId, hash)
      }
    }

    messageIds.clear()
    userIds.clear()
    //////

    for (const [id, board] of boardMap) {
      if (index === 0 || index % 10 === 0) {
        console.log('...', percentStr(index, count), index, count)
      }
      const levels = getAvailableUserLevels(board.settings.forGroups)

      const pipeline = this.redis.pipeline()
      for (const level of levels) {
        const keyStatHash = KEY.getKeyBoardStatHash(id, level)
        const keyTopicBoardNumMessages = KEY.getKeyTopicBoardNumMessagesLevel(id, level)
        const keyTopicBoard = KEY.getKeyTopicBoardLevel(id, level)

        const tmp = await this.redis.zrange(keyTopicBoardNumMessages, 0, 10000000, 'WITHSCORES')
        const boardNumMessagesMap = zResultWithScoresToMap(tmp)
        let countMessages = zResultWithScoresToSum(tmp)

        const countTopics = boardNumMessagesMap.size //await this.redis.zcard(KEY.getKeyTopicBoardLevel(id, level))

        const lastTopicId = firstInt(await this.redis.zrevrange(keyTopicBoard, 0, 1))
        const lastTopic = topicMap.get(lastTopicId)

        const lastMessageIdKey = getLevelToLastMessageIdKey(board.id, level)
        const lastMessageId = levelToLastMessageId[lastMessageIdKey] ?? 0
        const lastMessage = messageHashMap.get(lastMessageId)
        const lastUser = lastMessage ? userHashMap.get(lastMessage?.user) : undefined

        const statHash: Partial<RedisBoardStatHash> = {
          id,
          nt: countTopics,
          nm: countMessages,
          lt_id: lastTopic?.id ?? 0,
          lt_url: lastTopic?.url ?? '',
          lt_subject: lastTopic?.subject ?? '',
          lm_id: lastMessage?.id ?? 0,
          lm_date: lastMessage?.date,
          lu_id: lastUser?.id ?? 0,
          lu_name: lastUser?.name,
          lu_url: lastUser?.url ?? '',
        }

        pipeline.zadd(KEY.getKeyBoardNumTopicsLevel(level), numberToScore(countTopics) + '', id + '')
        pipeline.zadd(KEY.getKeyBoardNumMessagesLevel(level), numberToScore(countMessages) + '', id + '')
        pipeline.hset(keyStatHash, statHash)
      }
      await pipeline.exec()
      index++
    }
    console.log('...', '100%')
  }
}

const firstInt = (arr: string[]): number => arr && arr.length > 0 ? toInt(arr[0]) : 0

const dateToNumber = (date?: Date) => date ? (date!.getTime() / 1000) >>> 0 : 0

const toSimpleGender = (gender: Gender): 'f' | 'm' | '' =>
  gender === Gender.Male ? 'm' :
    gender === Gender.Female ? 'f' : ''

const filterUserLevels = (levels: UserLevel[]) => levels.filter(l => l !== UserLevel.banned && l !== UserLevel.moderator)

const getAvailableUserLevels = (groups: number[] | 'all' | undefined = [-1, 0]) => filterUserLevels(
  groups === 'all' ?
    Object.values(UserLevel) :
    getUserLevelsByGroups(
      [
        ...userLevelsGroupIds[UserLevel.admin],
        ...userLevelsGroupIds[UserLevel.moderator],
        ...(groups ?? [-1, 0]),
      ]
    )
)
