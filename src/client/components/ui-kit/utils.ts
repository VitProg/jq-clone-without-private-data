import { isString } from '../../../common/type-guards'
import { IntlShape } from 'react-intl'

export const joinClassNames = (...classNames: (string | undefined | null)[]) => {
  return classNames
    .filter(Boolean)
    .join(' ')
}

export const joinClassNamesMass =
  <T extends Record<string, string>, K extends keyof T>(classNamesMap1: T, classNamesMap2: Partial<T>): T => {
    const result: any = {}
    for (const [k, v] of Object.entries(classNamesMap1)) {
      result[k as any] = joinClassNames(v, classNamesMap2[k])
    }
    return result
  }


export const translateField = (
  intl: IntlShape,
  prefix?: string,
  type?: string,
  key?: any
) => !key || !type || !prefix || !isString(key) ?
  key :
  intl.formatMessage({id: `${prefix}:${type}.${key}`})
