import { ApiProperty } from '@nestjs/swagger'
import { IBoardEx, IMessageEx, ITopicEx, IUserEx } from '../../../../common/forum/forum.ex.interfaces'
import { IUserPartEx } from '../../../../common/forum/forum.part-ex.interfaces'
import { MessagePartExModel } from './message-part-ex.model'
import { UserPartExModel } from './user-part-ex.model'
import { BoardExModel } from './board-ex.model'
import { TopicExModel } from './topic-ex.model'
import { UserExModel } from './user-ex.model'


export class MessageExModel implements IMessageEx {
  @ApiProperty()
  id!: number

  @ApiProperty()
  date!: Date

  @ApiProperty()
  editDate?: Date

  @ApiProperty()
  board!: BoardExModel | number

  @ApiProperty()
  topic!: TopicExModel | number

  @ApiProperty()
  user!: UserExModel | number

  @ApiProperty()
  body?: string

  @ApiProperty()
  flags!: {
    isApproved: boolean
  }

  @ApiProperty()
  rate!: {
    plus: number
    minus: number
  }
}
