import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SecureService } from './modules/secure/secure.service'
import { tap } from 'rxjs/operators'

@Injectable()
export class TestInterceptor implements NestInterceptor {
  constructor (
    private readonly secureService: SecureService
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next
      .handle()
      // .pipe(
      //   tap(() => this.secureService.generateFingerprintLight())
      // )
  }
}
