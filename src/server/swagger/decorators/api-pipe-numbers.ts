import { applyDecorators } from '@nestjs/common'
import { ApiParam, ApiQuery } from '@nestjs/swagger'


export const ApiPipeNumbers = (name: string, where: 'query' | 'param'): MethodDecorator => {
  return applyDecorators(
    (where === 'param' ? ApiParam : ApiQuery)({
      name,
      style: 'pipeDelimited',
      type: 'number',
      schema: {
        type: 'array',
        items: { type: 'number' },
      }
    }),
  )
}

