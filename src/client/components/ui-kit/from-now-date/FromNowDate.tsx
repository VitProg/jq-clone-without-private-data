import { FC, useMemo, useState } from 'react'
import { dayjs, fromNowDate } from '../../../utils/date'
import useDate from '../../../hooks/use-date.hook'


interface Props {
  date?: Date
  format?: string
  withoutSuffix?: boolean
  toggleable?: boolean
  className?: string
}

export const FromNowDate: FC<Props> = (props) => {
  const {
    date,
    format = 'lll',
    toggleable = true,
    withoutSuffix = false,
    className,
  } = props

  if (!date) {
    return null
  }

  const { formatted, iso, rel } = useMemo(() => {
    const d = dayjs(date)
    const formatted = d.format(format)
    const rel = fromNowDate(d)
    const iso = d.toISOString()

    return {
      formatted,
      rel,
      iso,
    }
  }, [date])

  if (rel === formatted) {
    return (<time className={className} dateTime={iso}>{formatted}</time>)
  }

  if (!toggleable) {
    return (<time className={className} dateTime={iso} title={formatted}>{rel}</time>)
  }

  const [showRel, setShowRel] = useState(true)

  const toggleShowRel = () => setShowRel(!showRel)

  const now = useDate({ interval: 'minute' })

  return (
    <time
      className={className}
      data-now={now.toISOString()}
      style={{ cursor: 'pointer' }}
      dateTime={iso}
      onClick={toggleShowRel}
      title={showRel ? formatted : ''}
    >
      {showRel ? rel : formatted}
    </time>)
}
