import { ApiProperty } from '@nestjs/swagger'


export class GetDynamicDataDto {
  @ApiProperty()
  ids?: number[]

  @ApiProperty()
  withUser?: boolean
}
