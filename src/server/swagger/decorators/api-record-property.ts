import { applyDecorators, Type } from '@nestjs/common'
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'


export const ApiRecordProperty = <TModel extends Type<any>> (model: TModel): PropertyDecorator => {
  return applyDecorators(
    ApiProperty({
      type: 'object',
      additionalProperties: {
        items: {
          $ref: getSchemaPath(model)
        }
      }
    })
  )
}


