import { AnyObject, ArrayValues } from './types'


export function omit<R extends AnyObject, Keys extends Array<keyof R>>(record: R, ...omitKeys: Keys): Omit<R, ArrayValues<Keys>> {
  const out: any = {}
  const keys = Object.keys(record).filter(key => !omitKeys.includes(key as any))
  for (const key of keys) {
    out[key] = (record as any)[key]
  }
  return out as any
}

export function pick<R extends AnyObject, Keys extends Array<keyof R>>(record: R, ...omitKeys: Keys): Pick<R, ArrayValues<Keys>> {
  const out: any = {}
  const keys = Object.keys(record).filter(key => omitKeys.includes(key as any))
  for (const key of keys) {
    out[key] = (record as any)[key]
  }
  return out as any
}

