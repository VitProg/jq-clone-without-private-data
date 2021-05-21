import { forwardRef, Module } from '@nestjs/common'
import { ToRedisService } from './to-redis.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { entitiesList } from '../../../entities/list'
import { ConsoleModule } from 'nestjs-console'
import { TopicModule } from '../../forum/topic/topic.module'
import { MessageModule } from '../../forum/message/message.module'
import { UserModule } from '../../user/user.module'
import { BoardModule } from '../../forum/board/board.module'

@Module({
  imports: [
    ConsoleModule,
    TypeOrmModule.forFeature(entitiesList),
    forwardRef(() => UserModule),
    forwardRef(() => BoardModule),
    forwardRef(() => MessageModule),
    forwardRef(() => TopicModule),
  ],
  providers: [ToRedisService],
  exports: [ToRedisService],
})
export class ToRedisModule {}
