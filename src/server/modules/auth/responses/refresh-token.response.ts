import { IRefreshTokenResponse } from '../../../../common/responses/auth.responses'
import { ApiProperty } from '@nestjs/swagger'


export class RefreshTokenResponse implements IRefreshTokenResponse {
  @ApiProperty()
  accessToken!: string
}
