import { Transform } from 'class-transformer'
import { isArray, isString } from '../../common/type-guards'

type Props = {
  only?: "left" | "right"
  each?: boolean
}

export function Trim(props?: Props) {
  return (target: any, key: string) => {
    return Transform((value: any) => {
      if (isString(value)) {
        return trim(value, props)
      }
      if (isArray(value) && props?.each) {
        return value.map(v => isString(v) ? trim(v, props) : v)
      }
      return value
    })(target, key);
  };
}

function trim (value: string, props?: Props) {
  if (props?.only) {
    if (props?.only === "left") {
      return value.trimLeft()
    }

    return value.trimRight()
  }

  return value.trim()
}
