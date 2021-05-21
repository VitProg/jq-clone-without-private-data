import { IBoard, ICategory } from '../../../../common/forum/forum.base.interfaces'
import { ApiProperty } from '@nestjs/swagger'


export class CategoryModel implements ICategory {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string

  @ApiProperty()
  settings!: {
    order: number
  }
}
