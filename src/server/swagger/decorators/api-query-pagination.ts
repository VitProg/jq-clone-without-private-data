import { applyDecorators, Type } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'


export const ApiQueryPagination = (): MethodDecorator => {
  return applyDecorators(
    ApiQuery({ name: 'page', type: Number, required: false }),
    ApiQuery({ name: 'pageSize', type: Number, required: false }),
  )
}

