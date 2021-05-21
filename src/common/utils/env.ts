import { isNumber } from '../type-guards'


export const intValue = (envValue: any, defaultValue: number): number => {
  if (envValue && (envValue + '').length > 0) {
    const int = parseInt(envValue, 10)
    return int > 0 && !isNaN(int) && !isFinite(int) ? int : defaultValue
  }
  return defaultValue
}
export const stringValue = <S extends string | undefined> (envValue: any, defaultValue?: S): S extends string ? string : string | undefined => {
  if (envValue && (envValue + '').length > 0) {
    const str = (envValue + '').trim()
    return str && str.length > 0 ? str : defaultValue as any
  }
  return defaultValue as any
}
export const intArray = (envValue: any, defaultValue: number[]): number[] => {
  const str = stringValue(envValue, '')
  if (!str || str.length <= 0) {
    return defaultValue
  }

  return str
    .split(',')
    .map(i => parseInt(i, 10))
    .filter(isNumber) as number[]
}
