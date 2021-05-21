import { Module } from '@nestjs/common'
import { MyController } from './my.controller'
import { UserModule } from '../user/user.module'


@Module({
  imports: [
    UserModule,
  ],
  controllers: [
    MyController,
  ],
})
export class MyModule {
}
