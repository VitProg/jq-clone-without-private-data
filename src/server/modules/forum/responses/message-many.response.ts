import { IForumMessageManyResponse } from '../../../../common/responses/forum.responses'
import { PaginationResponse } from '../../../common/responses/pagination.response'
import { IMessage } from '../../../../common/forum/forum.base.interfaces'
import { MessageModel } from '../models/message.model'
import { MessageRelationsDto } from '../dto/message-relations.dto'
import { MessageExModel } from '../models-ex/message-ex.model'


export class MessageManyResponse extends PaginationResponse<MessageExModel> implements IForumMessageManyResponse {
  readonly items!: MessageExModel[]
}
