import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'
// import 'dayjs/locale/es'
// import 'dayjs/locale/de'

dayjs.extend(RelativeTime)
dayjs.extend(LocalizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(process.env.LOCALE ?? 'en')
dayjs.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone)

export {dayjs}


export const fromNowDate = (date: Date | dayjs.Dayjs, dateFormat?: string): string => {
  const d = dayjs(date)
  const diff = Math.abs(d.diff(new Date(), 'month'))

  if (diff <= 6) {
    return d.fromNow()
  }
  return d.format(dateFormat ?? 'lll')
}
