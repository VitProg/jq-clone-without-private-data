import { Module } from '@nestjs/common';
import { SecureService } from './secure.service';

@Module({
  providers: [SecureService],
  exports: [SecureService],
})
export class SecureModule {}
