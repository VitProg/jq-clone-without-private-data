import { applyDecorators } from '@nestjs/common'
import { ApiParam, ApiQuery, ApiQueryOptions } from '@nestjs/swagger'
import { ApiParamOptions } from '@nestjs/swagger/dist/decorators/api-param.decorator'


export function ApiPipeStrings(options: {
  name: string,
  where: 'query' | 'param',
  enum?: any,
  enumName?: string
} & Omit<ApiQueryOptions, 'name'> ): MethodDecorator {
  const { enum: _enum, enumName, ...otherOptions } = options

  const decoratorOptions: ApiQueryOptions & ApiParamOptions = {
    ...otherOptions,
    style: 'pipeDelimited',
    // ...(_enum ? { enum: _enum, enumName: enumName } : {}),
    schema: {
      type: 'array',
      items: {
        ...(
          _enum ? { enum: _enum, } : { type: 'string' }
        ),
      },
    },
  }

  return applyDecorators(
    options.where === 'param' ?
      ApiParam(decoratorOptions) :
      ApiQuery(decoratorOptions)
  )
}

