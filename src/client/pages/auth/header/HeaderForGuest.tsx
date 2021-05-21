import { FC } from 'react'
import { RouteLink } from '../../../components/route/RouteLink'
import { Button } from '@material-ui/core'
import { useFormatMessage } from '../../../hooks/use-format-message.hook'


export const HeaderForGuest: FC = (props) => {
  const t = useFormatMessage()

  return (
    <>
      <RouteLink to={'registration'} component={Button} color="inherit">{t('Common:registration')}</RouteLink>
      <RouteLink to={'login'} component={Button} color="inherit">{t('Common:login')}</RouteLink>
    </>
  )
}
