import { ArgumentMetadata, Injectable, ParseIntPipe, PipeTransform } from '@nestjs/common'
import { isNone, isNumber, isString } from '../../common/type-guards'

// @Injectable()
export class ParseIntOptionalPipe implements PipeTransform<string | undefined, number | undefined> {
  constructor (private readonly options?: {
    min?: number,
    max?: number
  }) {
  }

  transform(value: any, metadata: ArgumentMetadata) {
    let result = value != '' && isNone(value) ? undefined : parseInt(value.toString(), 10)

    if (result === undefined) {
      return undefined
    }

    if (isNumber(result) && !isNaN(result) && isFinite(result)) {
      result = result >>> 0

      if (this.options && isNumber(this.options.max)) {
        result = Math.min(this.options.max, result)
      }
      if (this.options && isNumber(this.options.min)) {
        result = Math.max(this.options.min, result)
      }
      return result
    }
    return undefined
  }
}
