import { Module } from '@nestjs/common';
import { UserDbService } from './user-db.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionService } from './permission/permission.service';
import { UserGroupService } from './user-group/user-group.service';
import * as Entities from '../../entities'
import { ForumCacheModule } from '../forum/forum-cache/forum-cache.module'
import { UserController } from './user.controller';
import { UserRedisService } from './user-redis.service';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Entities.MemberEntity,
      Entities.MemberGroupEntity,
      Entities.PermissionEntity,
    ]),
    ForumCacheModule,
  ],
  providers: [
    UserDbService,
    PermissionService,
    UserGroupService,
    UserRedisService,
    UserService,
  ],
  exports: [
    UserService,
    UserDbService,
    UserRedisService,
  ],
  controllers: [UserController]
})
export class UserModule {}
