import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IUser } from '../../../../common/forum/forum.base.interfaces'


@Injectable()
export class WithUserGuard extends AuthGuard('jwt') {

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest<TUser = IUser>(err: any, user: any, info: any, context: any, status?: any): TUser {
      return user;
  }

}
