import { isArray, isMap, isObject } from '../type-guards'


export function * walkByAny<K extends keyof any, V> (
  data: Map<K, V> | Record<K, V> | V[]
): IterableIterator<V> {
  if (isArray(data)) {
    for (const item of data) {
      yield item
    }
  } else if (isMap<K, V>(data)) {
    for (const [, item] of data) {
      yield item
    }
  } else if (isObject(data)) {
    for (const item of Object.values(data)) {
      yield item as V
    }
  }
}
