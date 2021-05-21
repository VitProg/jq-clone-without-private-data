import { forwardRef, Module } from '@nestjs/common'
import { BoardController } from './board.controller'
import { ForumCacheModule } from '../forum-cache/forum-cache.module'
import { BoardDbService } from './board-db.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as Entities from '../../../entities'
import { MessageModule } from '../message/message.module'
import { CategoryModule } from '../category/category.module'
import { TopicModule } from '../topic/topic.module'
import { UserModule } from '../../user/user.module'
import { BoardService } from './board.service';
import { BoardRedisService } from './board-redis.service'


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Entities.BoardEntity,
    ]),
    ForumCacheModule,
    CategoryModule,
    forwardRef(() => TopicModule),
    forwardRef(() => MessageModule),
    UserModule,
  ],
  controllers: [BoardController],
  providers: [
    BoardDbService,
    BoardRedisService,
    BoardService,
  ],
  exports: [
    BoardService,
    BoardDbService,
  ],
})
export class BoardModule {
}
