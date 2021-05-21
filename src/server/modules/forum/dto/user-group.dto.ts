import { IUserGroup } from '../../../../common/forum/forum.base.interfaces'
import { ApiProperty } from '@nestjs/swagger'


export class UserGroupDto implements IUserGroup {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string

  @ApiProperty({required: false})
  minPosts?: number

  @ApiProperty({required: false})
  maxMessages?: number

  @ApiProperty({required: false})
  color?: string
}
