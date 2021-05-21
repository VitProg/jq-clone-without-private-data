import { forwardRef, Module } from '@nestjs/common'
import { TopicDbService } from './topic-db.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TopicController } from './topic.controller'
import * as Entities from '../../../entities'
import { BoardModule } from '../board/board.module'
import { CategoryModule } from '../category/category.module'
import { MessageModule } from '../message/message.module'
import { UserModule } from '../../user/user.module'
import { TopicRedisService } from './topic-redis.service';
import { TopicService } from './topic.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Entities.RelatedSubjectEntity,
      Entities.RelatedSubjectEntity,
      Entities.TopicEntity,
    ]),
    forwardRef(() => BoardModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => MessageModule),
    forwardRef(() => UserModule),
  ],
  providers: [TopicDbService, TopicRedisService, TopicService],
  exports: [
    TopicService,
    TopicDbService,
  ],
  controllers: [TopicController],
})
export class TopicModule {
}
