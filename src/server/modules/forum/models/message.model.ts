import { IMessage } from '../../../../common/forum/forum.base.interfaces'
import { UserModel } from '../../user/models/user.model'
import { ApiProperty } from '@nestjs/swagger'
import { TopicModel } from './topic.model'
import { BoardModel } from './board.model'


export class MessageModel implements IMessage {
  @ApiProperty()
  id!: number

  @ApiProperty()
  body!: string

  @ApiProperty()
  dates!: {
    createdAt?: Date
    updatedAt?: Date
  }

  @ApiProperty()
  flags!: {
    isApproved?: boolean
  }

  @ApiProperty()
  linksId!: {
    user: number
    topic: number
    board: number
  }

  @ApiProperty()
  statistics!: {
    ratePlus: number,
    rateMinus: number,
  }
}
