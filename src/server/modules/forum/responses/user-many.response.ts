import { IForumUserManyResponse } from '../../../../common/responses/forum.responses'
import { PaginationResponse } from '../../../common/responses/pagination.response'
import { UserModel } from '../../user/models/user.model'


export class UserManyResponse extends PaginationResponse<UserModel> implements IForumUserManyResponse {
  readonly items!: UserModel[]
}
