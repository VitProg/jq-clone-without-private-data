import { FC } from 'react'
import { AppBar, Box, Button, Container, Link, Toolbar, Typography } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { HeaderForUser } from '../pages/auth/header/HeaderForUser'
import { HeaderForGuest } from '../pages/auth/header/HeaderForGuest'
import { RouteLink } from '../components/route/RouteLink'
import { store } from '../store'
import { useHeaderStyles } from './styles'
import { HideOnScroll } from '../components/utils/HideOnScroll'


export const Header: FC = observer(function Header (props) {
  const classes = useHeaderStyles()

  return (
    <header className={classes.container}>
      <HideOnScroll>
        <AppBar position="fixed">
          <Container maxWidth="lg" component={Toolbar} className={classes.toolbar}>
            <Typography variant="h6" className={classes.title}>
              <RouteLink to={'boardList'} component={Link} color="inherit">JQ Forum React</RouteLink>
            </Typography>
            <nav className={`${classes.menu} ${classes.grow}`}>
              <RouteLink to={'lastMessages'} component={Button} color="inherit">Сообщения</RouteLink>
            </nav>
            <Box className={classes.userArea}>
              {store.myStore.user ?
                <HeaderForUser user={store.myStore.user}/> :
                <HeaderForGuest/>
              }
            </Box>
          </Container>
        </AppBar>
      </HideOnScroll>
    </header>
  )
})

