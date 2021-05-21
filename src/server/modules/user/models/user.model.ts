import { Gender, UserLevel } from '../../../../common/forum/forum.constants'
import { ApiProperty } from '@nestjs/swagger'
import { UserGroupDto } from '../../forum/dto/user-group.dto'
import { IUser, IUserGroup } from '../../../../common/forum/forum.base.interfaces'


export class UserModel implements IUser {
  @ApiProperty()
  id!: number

  @ApiProperty()
  email?: string

  @ApiProperty()
  login!: string

  @ApiProperty()
  displayName!: string

  @ApiProperty()
  url!: string

  @ApiProperty()
  avatar!: string

  @ApiProperty()
  gender!: Gender

  @ApiProperty()
  level!: UserLevel

  @ApiProperty()
  dates!: {
    lastLogin?: Date
    registered?: Date
  }

  @ApiProperty()
  statistics!: {
    posts: number
    karmaPlus: number
    karmaMinus: number
  }

  @ApiProperty()
  flags!: {
    isActivated: boolean
  }

  @ApiProperty()
  settings!: {
    timeOffset: number
    permissions?: string[]
    groupIds: number[]
    groups?: IUserGroup[]
  }
}
