import { ApiProperty } from '@nestjs/swagger'
import { IBoardEx, ITopicEx } from '../../../../common/forum/forum.ex.interfaces'
import {
  ICategoryPartEx,
  IMessagePartEx,
  ITopicPartEx,
  IUserPartEx
} from '../../../../common/forum/forum.part-ex.interfaces'
import { MessagePartExModel } from './message-part-ex.model'
import { UserPartExModel } from './user-part-ex.model'
import { CategoryPartExModel } from './category-part-ex.model'
import { TopicPartExModel } from './topic-part-ex.model'


export class BoardExModel implements IBoardEx {
  @ApiProperty()
  id!: number

  @ApiProperty()
  url!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  description!: string

  @ApiProperty()
  groups?: number[]

  @ApiProperty()
  level!: number

  @ApiProperty()
  parentId!: number

  @ApiProperty()
  category!: CategoryPartExModel

  @ApiProperty()
  counters?: {
    topic: number
    message: number
  }

  @ApiProperty()
  last!: {
    message?: MessagePartExModel
    user?: UserPartExModel
    topic?: TopicPartExModel
  }
}
