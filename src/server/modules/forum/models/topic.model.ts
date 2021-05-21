import { IBoard, ITopic } from '../../../../common/forum/forum.base.interfaces'
import { ApiProperty } from '@nestjs/swagger'
import { BoardModel } from './board.model'


export class TopicModel implements ITopic {
  @ApiProperty()
  id!: number

  @ApiProperty()
  url!: string

  @ApiProperty()
  subject!: string

  @ApiProperty()
  flags!: {
    isLocked: boolean
    isSticky: boolean
    isApproved: boolean
    isStickyFirstPost: boolean
  }

  @ApiProperty()
  linksId!: {
    poll?: number
    board: number
    firstMessage: number
    lastMessage: number
  }

  @ApiProperty()
  counters?: {
    messages: number
  }
}
