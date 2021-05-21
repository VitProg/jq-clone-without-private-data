import { AnyObject } from './utils/types'


export const isArray = <V>(val: any): val is Array<V> => {
  return Array.isArray(val)
}

export function isFunction<F extends ((...args: any[]) => any) = ((...args: any[]) => any)>(
  val: any
): val is F {
  return typeof val === 'function'
}

export const isObject = <T extends AnyObject>(val: any): val is T => {
  return !isArray(val) && typeof val === 'object'
}

export const isMap = <K extends keyof any = keyof any, V extends any = any>(val: any): val is Map<K, V> => {
  return val instanceof Map
}

export const isSet = <V extends any = any>(val: any): val is Set<V> => {
  return val instanceof Set
}

export const isNumber = (val: any): val is number => {
  return typeof val === 'number' && !isNaN(val) && isFinite(val)
}

export const isString = (val: any): val is string => {
  return typeof val === 'string'
}

export const isUndefined = (val: any): val is undefined => typeof val === 'undefined'
export const isNull = (val: any): val is null => val === null
export const isNone = (val: any): val is null | undefined => isUndefined(val) || isNull(val)

export function isPromise<T extends any = any>(value: Promise<T> | any): value is Promise<T> {
  return isObject(value) && value instanceof Promise;
}
