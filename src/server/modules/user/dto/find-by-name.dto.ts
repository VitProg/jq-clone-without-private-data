import { ApiProperty } from '@nestjs/swagger'


export class FindByNameDto {
  @ApiProperty()
  name!: string
}
