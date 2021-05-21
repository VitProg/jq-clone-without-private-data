import { IForumTopicManyResponse } from '../../../../common/responses/forum.responses'
import { PaginationResponse } from '../../../common/responses/pagination.response'
import { TopicModel } from '../models/topic.model'
import { TopicRelationsDto } from '../dto/topic-relations.dto'
import { TopicExModel } from '../models-ex/topic-ex.model'


export class TopicManyResponse extends PaginationResponse<TopicExModel> implements IForumTopicManyResponse {
  readonly items!: TopicExModel[]
}
