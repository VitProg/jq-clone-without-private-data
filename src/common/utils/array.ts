import { isArray, isMap, isSet } from '../type-guards'
import { randomInt } from './number'


export const arraysDiff = <A extends any, B extends any>(arrayA: A[], arrayB: B[]): Array<A | B> => {
  return (arrayA as any[])
    .filter(x => !arrayB.includes(x))
    .concat((arrayB as any[])
      .filter(x => !arrayA.includes(x))
    )
}

export const arraysIsEquals = <A extends any, B extends any>(arrayA: A[], arrayB: B[]) => arraysDiff(arrayA, arrayB).length === 0

export const concatArrays = <I>(...arrays: I[][]): I[] => {
  const result: I[] = []
  for (const arr of arrays) {
    result.push(...arr)
  }
  return result
}

export const uniqueArray = <I>(values: (I[] | Map<any, I> | Set<I>)): I[] => {
  if (isMap(values)) {
    const set = new Set([...values.values()])
    return [...(set.values())]
  }
  if (isSet(values)) {
    return [...(values.values())]
  }
  if (isArray(values)) {
    const set = new Set(values)
    return [...(set.values())]
  }
  return []
}

export const mapToRecord = <K extends keyof any, V>(map: Map<K, V>): Record<K, V> => {
  return Object.fromEntries([...map.entries()]) as any
}

export const recordToMap = <K extends keyof any, V>(record: Record<K, V>): Map<K, V> => {
  return new Map(Object.entries(record)) as any
}

export const randomIndex = (arr: any[]): number => randomInt(0, arr.length - 1)
export const randomItem = <K>(arr: K[]): K | undefined => arr.length > 0 ? arr[randomIndex(arr)] : undefined
