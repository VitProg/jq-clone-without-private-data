import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsArray, IsString, ArrayNotEmpty } from 'class-validator'
import { Trim } from '../../../class-transformer/trim'


export class FindByNamesDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @Trim({ each: true })
  names!: string[]
}
