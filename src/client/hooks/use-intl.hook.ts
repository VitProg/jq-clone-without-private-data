import { IntlShape, MessageDescriptor, useIntl as useIntlOrig } from 'react-intl'
import { FormatXMLElementFn, PrimitiveType } from 'intl-messageformat'
import ru from '../ru.json'
import { ReactNode } from 'react'


type MessageDescriptorEx = Omit<MessageDescriptor, 'id'> & {
  id: keyof typeof ru | string | number
}

interface IntlShapeEx extends Omit<IntlShape, 'formatMessage'> {
  formatMessage (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>): string;
  formatMessage (descriptor: MessageDescriptorEx, values?: Record<string, PrimitiveType | ReactNode | FormatXMLElementFn<ReactNode, ReactNode>>): ReactNode;
}

export const useIntl = (): IntlShapeEx => {
  return useIntlOrig() as any
}
