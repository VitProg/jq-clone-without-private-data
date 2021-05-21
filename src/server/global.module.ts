import { CacheModule, Global, Module } from '@nestjs/common'
import { REDIS_CLIENT } from './di.symbols'
import { RedisModule, RedisService } from 'nestjs-redis'
import { ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-ioredis'
import { IConfiguration } from './config/types'
import { isPromise } from '../common/type-guards'

// noinspection JSUnfilteredForInLoop
@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService<IConfiguration>) => configService.get('redis')!,
      inject: [ConfigService]
    }),

    CacheModule.registerAsync({
      useFactory: (configService: ConfigService<IConfiguration>) => (
        {
          store: redisStore,
          ...configService.get('redis'),
          ttl: 10,
          // max: 1000,
        }
      ),
      inject: [ConfigService]
    }),
  ],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService, RedisService],
      useFactory: (configService: ConfigService<IConfiguration>, redisService: RedisService) => {
        if (!!configService.get('loggingRedis')) {
          const redis: any = redisService.getClient()

          for (const key in redis) {
            if (typeof redis[key] === 'function' && ['sendCommand'].includes(key)) {
              const orig = redis[key] as (...args: any[]) => any
              redis[key] = function (this: any, ...args: any[]) {
                console.log('REDIS Client Call:', key,  args[0].name, args[0].args.join('; '), /*result*/)
                const result = orig.apply(this, args)
                if (isPromise(result)) {
                  result
                    .then(data => {
                      // console.log('REDIS Client Call async:', key, args[0].name, args[0].args.join('; '), /*data*/)
                      return data
                    })
                    .catch(err => {
                      console.warn('REDIS Client Call async CATCH:', key,  args[0].name, args[0].args.join('; '), err)
                      return err
                    })
                  return result
                }
                return result
              }
            }
          }
          return redis
        } else {
          return redisService.getClient()
        }
      },
    },
  ],
  exports: [
    RedisModule,
    REDIS_CLIENT,
    CacheModule,
  ]
})
export class GlobalModule {

}
