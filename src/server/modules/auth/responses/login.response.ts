import { ApiProperty } from '@nestjs/swagger'
import { ILoginResponse } from '../../../../common/responses/auth.responses'


export class LoginResponse implements ILoginResponse {
  @ApiProperty()
  accessToken!: string
}
