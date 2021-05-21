import { ApiProperty } from '@nestjs/swagger'
import { ITopicEx } from '../../../../common/forum/forum.ex.interfaces'
import { IUserPartEx } from '../../../../common/forum/forum.part-ex.interfaces'
import { MessagePartExModel } from './message-part-ex.model'
import { UserPartExModel } from './user-part-ex.model'


export class TopicExModel implements ITopicEx {
  @ApiProperty()
  id!: number

  @ApiProperty()
  subject!: string

  @ApiProperty()
  url!: string

  @ApiProperty()
  boardId!: number

  @ApiProperty()
  flags!: {
    isApproved: boolean
    isPinned: boolean
    isPinnedFirstMessage: boolean
  }

  @ApiProperty()
  first!: {
    message?: MessagePartExModel
    user?: IUserPartEx
  }

  @ApiProperty()
  last!: {
    message?: MessagePartExModel
    user?: UserPartExModel
  }

  @ApiProperty()
  counters?: {
    message: number
  }
}
