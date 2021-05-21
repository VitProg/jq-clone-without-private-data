import { container } from './ioc.container'
import { IApiService } from '../services/types'
import { ApiService } from '../services/api.service'
import {
  ApiServiceSymbol,
  AuthServiceSymbol, BoardPrepareServiceSymbol, BoardServiceSymbol, CategoryPrepareServiceSymbol, CategoryServiceSymbol,
  ForumServiceSymbol,
  MessagePrepareServiceSymbol,
  MessageServiceSymbol,
  ProfileServiceSymbol, TopicPrepareServiceSymbol, TopicServiceSymbol, UserPrepareServiceSymbol, UserServiceSymbol
} from '../services/ioc.symbols'
import { AuthService } from '../services/my/auth.service'
import { IAuthService, IProfileService } from '../services/my/types'
import { ProfileService } from '../services/my/profile.service'
import type {
  IForumService,
  IMessagePrepareService,
  IMessageService,
  ITopicPrepareService,
  ITopicService
} from '../services/forum/types'
import { MessageService } from '../services/forum/message/message.service'
import { ForumService } from '../services/forum/forum.service'
import { MessagePrepareService } from '../services/forum/message/message-prepare.service'
import { CategoryPrepareService } from '../services/forum/category/category-prepare.service'
import { BoardPrepareService } from '../services/forum/board/board-prepare.service'
import { BoardService } from '../services/forum/board/board.service'
import { TopicPrepareService } from '../services/forum/topic/topic-prepare.service'
import { TopicService } from '../services/forum/topic/topic.service'
import { UserService } from '../services/forum/user/user.service'
import { UserPrepareService } from '../services/forum/user/user-prepare.service'

container.bind<IApiService>(ApiServiceSymbol).to(ApiService)
container.bind<IAuthService>(AuthServiceSymbol).to(AuthService)
container.bind<IProfileService>(ProfileServiceSymbol).to(ProfileService)

container.bind<IForumService>(ForumServiceSymbol).to(ForumService)

container.bind<IMessageService>(MessageServiceSymbol).to(MessageService)
container.bind<IMessagePrepareService>(MessagePrepareServiceSymbol).to(MessagePrepareService)

container.bind<ITopicService>(TopicServiceSymbol).to(TopicService)
container.bind<ITopicPrepareService>(TopicPrepareServiceSymbol).to(TopicPrepareService)

container.bind<BoardService>(BoardServiceSymbol).to(BoardService)
container.bind<BoardPrepareService>(BoardPrepareServiceSymbol).to(BoardPrepareService)

container.bind<CategoryPrepareService>(CategoryPrepareServiceSymbol).to(CategoryPrepareService)

container.bind<UserService>(UserServiceSymbol).to(UserService)
container.bind<UserPrepareService>(UserPrepareServiceSymbol).to(UserPrepareService)



