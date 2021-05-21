import { IUser, IUserGroup } from '../../../../common/forum/forum.base.interfaces'
import { Gender } from '../../../../common/forum/forum.constants'
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { UserGroupDto } from '../../forum/dto/user-group.dto'
import { UserModel } from '../../user/models/user.model'


export class ProfileResponse extends UserModel {
}
