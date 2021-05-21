import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UserModule } from '../user/user.module'
import { SecureModule } from '../secure/secure.module'
import { AuthController } from './auth.controller';
import { RefreshTokenService } from './token/refresh-token.service';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy'
import { HttpStrategy } from './strategies/http-strategy.service'
import { JwtTokenService } from './token/jwt-token.service'


@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      // secret: jwtConstants.secret,
      // signOptions: { expiresIn: '60s' },
    }),
    SecureModule,
  ],
  providers: [
    AuthService,
    RefreshTokenService,
    JwtTokenService,
    LocalStrategy,
    HttpStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [
    AuthController,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {
}
