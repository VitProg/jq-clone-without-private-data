import { ICategoryPartEx, IMessagePartEx } from '../../../../common/forum/forum.part-ex.interfaces'
import { ApiProperty } from '@nestjs/swagger'


export class CategoryPartExModel implements ICategoryPartEx {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string
}
