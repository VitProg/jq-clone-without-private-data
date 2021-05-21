import lang from '../ru.json'
import { ReactNode } from 'react'
import { useIntl } from './use-intl.hook'


export const useFormatMessage = () => {
  const intl = useIntl()
  return (id: keyof typeof lang | string | number): string => intl.formatMessage({ id })
}
