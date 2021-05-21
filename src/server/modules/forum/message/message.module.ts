import { forwardRef, Module } from '@nestjs/common'
import { MessageController } from './message.controller'
import { MessageDbService } from './message-db.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as Entities from '../../../entities'
import { UserModule } from '../../user/user.module'
import { BoardModule } from '../board/board.module'
import { TopicModule } from '../topic/topic.module'
import { MessageService } from './message.service';
import { MessageRedisService } from './message-redis.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Entities.AttachmentEntity,
      Entities.BoardEntity,
      Entities.CategoryEntity,
      Entities.MemberEntity,
      Entities.MessageEntity,
      // Entities.PersonalMessageEntity,
      // Entities.PmAttachmentEntity,
      // Entities.PmRecipientEntity,
      // Entities.PollEntity,
      // Entities.PollChoiceEntity,
      // Entities.RelatedSubjectEntity,
      Entities.TopicEntity,
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => BoardModule),
    forwardRef(() => TopicModule),
  ],
  providers: [MessageDbService, MessageService, MessageRedisService],
  controllers: [MessageController],
  exports: [
    MessageDbService,
    MessageService,
  ],
})
export class MessageModule {
}
