import { ApiProperty } from '@nestjs/swagger'
import { ITopicEx, IUserEx } from '../../../../common/forum/forum.ex.interfaces'
import { IUserPartEx } from '../../../../common/forum/forum.part-ex.interfaces'
import { MessagePartExModel } from './message-part-ex.model'
import { UserPartExModel } from './user-part-ex.model'
import { Gender, UserLevel } from '../../../../common/forum/forum.constants'


export class UserExModel implements IUserEx {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string

  @ApiProperty()
  url!: string

  @ApiProperty()
  avatar!: string

  @ApiProperty()
  dates!: {
    lastLogin?: Date
    registration?: Date
  }

  @ApiProperty()
  settings!: {
    groups: number[]
    level: UserLevel
    gender: Gender
  }

  @ApiProperty()
  counters!: {
    topic: number
    message: number
  }

  @ApiProperty()
  karma!: {
    plus: number
    minus: number
  }

  @ApiProperty()
  lastSeen!: {
    messageId: number
  }

  @ApiProperty()
  flags!: {
    isActivated: boolean
  }
}
