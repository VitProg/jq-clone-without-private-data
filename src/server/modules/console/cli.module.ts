import { Module } from '@nestjs/common'
import { ConsoleModule } from 'nestjs-console'
import { ConfigModule } from '@nestjs/config'
import configuration from '../../config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CliService } from './cli.service'
import { BoardEntity, CategoryEntity, MemberGroupEntity, PermissionEntity } from '../../entities'
import { ToRedisModule } from './to-redis/to-redis.module';
import { GlobalModule } from '../../global.module'
import { ForumModule } from '../forum/forum.module'
import { UserModule } from '../user/user.module'


@Module({
  imports: [
    ConsoleModule, // import the ConsoleModule
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    GlobalModule,
    TypeOrmModule.forRoot(),
    ToRedisModule,
    ForumModule,
    UserModule,
  ],
  providers: [CliService],
  exports: [CliService],
})
export class CliModule {
}
