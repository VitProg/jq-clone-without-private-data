import { IUserPartEx } from '../../../../common/forum/forum.part-ex.interfaces'
import { ApiProperty } from '@nestjs/swagger'


export class UserPartExModel implements IUserPartEx {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string

  @ApiProperty()
  url!: string
}
