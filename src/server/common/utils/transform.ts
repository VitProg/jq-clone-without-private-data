import { Gender } from '../../../common/forum/forum.constants'


export function timestampToDate (timestamp: number) {
  return new Date((timestamp + (3 * 3600)) * 1000)
}

const genderMap: Record<number | string, Gender> = {
  1: Gender.Male,
  'm': Gender.Male,
  2: Gender.Female,
  'f': Gender.Female
}
export const toGender = (gender: number | 'f' | 'm' | '') => gender in genderMap ? genderMap[gender] : Gender.Unknown
