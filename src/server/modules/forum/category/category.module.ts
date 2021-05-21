import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { ForumCacheModule } from '../forum-cache/forum-cache.module'
import { CategoryService } from './category.service';


@Module({
  imports: [ForumCacheModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {
}
