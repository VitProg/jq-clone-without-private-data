import { FC, useCallback, useState, MouseEvent, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { UserAvatar } from '../../../components/user/UserAvatar'
import { Menu, MenuItem } from '@material-ui/core'
import { User } from '../../../../common/forum/models/user'
import { RouteLink } from '../../../components/route/RouteLink'
import { useInjection } from '../../../ioc/ioc.react'
import { AuthServiceSymbol } from '../../../services/ioc.symbols'
import { IAuthService } from '../../../services/my/types'
import { useIntl } from 'react-intl'
import { useFormatMessage } from '../../../hooks/use-format-message.hook'


interface Props {
  user?: User
}

export const HeaderForUser: FC<Props> = (function HeaderForUser (props) {
  if (!props.user) {
    return null
  }

  const t = useFormatMessage()

  const ref = useRef<HTMLDivElement>(null)
  const [menuOpened, setMenuOpened] = useState<null | HTMLElement>(null)
  const authService = useInjection<IAuthService>(AuthServiceSymbol)

  const handleAvatarClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (menuOpened) {
        setMenuOpened(null)
      } else {
        setMenuOpened(ref.current)
      }
    },
    [menuOpened],
  )

  const handleMenuClose = () => {
    setMenuOpened(null)
  }

  const handleLogoutClick = async () => {
    handleMenuClose()
    await authService.logout()
  }

  return (
    <div ref={ref}>
      <UserAvatar user={props.user} onCLick={handleAvatarClick}/>

      <Menu
        id="menu-appbar"
        anchorEl={menuOpened}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!menuOpened}
        onClose={handleMenuClose}
      >
        <RouteLink to={'profile'} component={MenuItem} onClick={handleMenuClose}>{t('MyMenu:profile')}</RouteLink>
        <RouteLink to={'settings'} component={MenuItem} onClick={handleMenuClose}>{t('MyMenu:settings')}</RouteLink>
        <MenuItem onClick={handleLogoutClick}>{t('Common:logout')}</MenuItem>
      </Menu>
    </div>
  )
})
