import { Module } from '@nestjs/common'
import { BoardModule } from './board/board.module'
import { TopicModule } from './topic/topic.module'
import { ForumCacheModule } from './forum-cache/forum-cache.module'
import { MessageModule } from './message/message.module'
import { CategoryModule } from './category/category.module';



@Module({
  imports: [
    ForumCacheModule,
    BoardModule,
    MessageModule,
    TopicModule,
    CategoryModule,
  ],
  exports: [
    BoardModule,
    MessageModule,
    TopicModule,
  ],
})
export class ForumModule {
}
