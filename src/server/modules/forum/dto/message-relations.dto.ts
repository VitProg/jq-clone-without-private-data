import { MessageRelationsRecord } from '../../../../common/forum/forum.entity-relations'
import { BoardModel } from '../models/board.model'
import { TopicModel } from '../models/topic.model'
import { UserModel } from '../../user/models/user.model'
import { ApiRecordProperty } from '../../../swagger/decorators/api-record-property'
import { CategoryModel } from '../models/category.model'


export class MessageRelationsDto implements MessageRelationsRecord {
  @ApiRecordProperty(BoardModel)
  board?: Record<number, BoardModel>

  @ApiRecordProperty(TopicModel)
  topic?: Record<number, TopicModel>

  @ApiRecordProperty(UserModel)
  user?: Record<number, UserModel>

  @ApiRecordProperty(CategoryModel)
  category?: Record<number, CategoryModel>
}
