import { ICategoryPartEx, IMessagePartEx, ITopicPartEx } from '../../../../common/forum/forum.part-ex.interfaces'
import { ApiProperty } from '@nestjs/swagger'


export class TopicPartExModel implements ITopicPartEx {
  @ApiProperty()
  id!: number

  @ApiProperty()
  url!: string

  @ApiProperty()
  subject!: string
}
