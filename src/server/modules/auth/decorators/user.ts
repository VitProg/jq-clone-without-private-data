import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { toUser } from '../../../common/utils/mapper'
import { getUserFromContext } from '../utils'


export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getUserFromContext(ctx)
)
