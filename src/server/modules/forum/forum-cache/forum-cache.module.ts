import { forwardRef, Inject, Module, OnModuleInit } from '@nestjs/common'
import { ForumCacheService } from './forum-cache.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BoardEntity, CategoryEntity, MemberGroupEntity, PermissionEntity } from '../../../entities'
import { BoardModule } from '../board/board.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardEntity,
      CategoryEntity,
      MemberGroupEntity,
      PermissionEntity,
    ]),
    forwardRef(() => BoardModule),
  ],
  providers: [
    ForumCacheService,
  ],
  exports: [
    ForumCacheService,
  ],
})
export class ForumCacheModule implements OnModuleInit {
  constructor (
    @Inject(forwardRef(() => ForumCacheService)) private readonly cacheService: ForumCacheService,
  ) {
  }

  async onModuleInit () {
    await this.cacheService.refresh(true)
  }
}
