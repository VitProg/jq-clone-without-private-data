import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserDbService } from '../../user/user-db.service'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { JwtStrategyValidatePayload } from '../types'
import { SecureService } from '../../secure/secure.service'
import { AuthService } from '../auth.service'
import { RefreshTokenService } from '../token/refresh-token.service'
import { UserService } from '../../user/user.service'
import { IUserEx } from '../../../../common/forum/forum.ex.interfaces'
import { JwtTokenService } from '../token/jwt-token.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly secureService: SecureService,
    private readonly jwtTokenService: JwtTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtStrategyValidatePayload) {
    const fingerprintLight = await this.secureService.generateFingerprintLight(request);

    const user: IUserEx | undefined = await this.userService.findById(payload.sub)

    if (await this.jwtTokenService.verify(payload, fingerprintLight, user)) {
      return user
    }

    throw new UnauthorizedException('jwt - not valid token');
  }
}
