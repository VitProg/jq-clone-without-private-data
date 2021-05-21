import { applyDecorators, UseGuards } from '@nestjs/common'
import { WithUserGuard } from '../guards/with-user.guard'


export const WithUser = (): MethodDecorator => {
  return applyDecorators(
    UseGuards(WithUserGuard)
  )
}
