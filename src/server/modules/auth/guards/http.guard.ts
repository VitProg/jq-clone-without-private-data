import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IUser } from '../../../../common/forum/forum.base.interfaces'


@Injectable()
export class HttpGuard extends AuthGuard('http') {

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest<TUser = IUser>(err: any, user: any, info: any, context: any, status?: any): TUser {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('http - handleRequest');
    }
    return user;
  }

}
