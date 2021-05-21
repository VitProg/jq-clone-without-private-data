import { isNumber } from '../type-guards'

export const MAX_NUMBER = Number.MAX_SAFE_INTEGER

export function between(value: number, min: number, max: number) {
  return Math.max(min, Math.max(min, value))
}

export const toInt = (val: string | null): number => {
  if (val === null) {
    return 0
  }
  const n = parseInt(val, 10)
  return isNumber(n) ? n : 0
}

export const toIntOptional = (val: string | null): number | undefined => {
  if (val === null) {
    return 0
  }
  const n = parseInt(val, 10)
  return isNumber(n) ? n : undefined
}

export const percent = (part: number, all: number) => (part / (all / 100))
export const percentStr = (part: number, all: number, fractionDigits = 2) => percent(part, all).toFixed(fractionDigits) + '%'

export const randomInt = (min: number, max: number) => {
  if (max <= min) {
    return min
  }
  return min + (Math.random() * (max - min)) >>> 0
}
