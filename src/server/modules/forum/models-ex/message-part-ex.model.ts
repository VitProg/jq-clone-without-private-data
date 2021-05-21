import { IMessagePartEx } from '../../../../common/forum/forum.part-ex.interfaces'
import { ApiProperty } from '@nestjs/swagger'


export class MessagePartExModel implements IMessagePartEx {
  @ApiProperty()
  id!: number

  @ApiProperty()
  date!: Date
}
