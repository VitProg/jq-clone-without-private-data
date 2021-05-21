import { MessageRelationsRecord, TopicRelationsRecord } from '../../../../common/forum/forum.entity-relations'
import { BoardModel } from '../models/board.model'
import { TopicModel } from '../models/topic.model'
import { UserModel } from '../../user/models/user.model'
import { ApiRecordProperty } from '../../../swagger/decorators/api-record-property'
import { CategoryModel } from '../models/category.model'


export class TopicRelationsDto implements TopicRelationsRecord {
  @ApiRecordProperty(BoardModel)
  board?: Record<number, BoardModel>

  @ApiRecordProperty(CategoryModel)
  category?: Record<number, CategoryModel>
}
