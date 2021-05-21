import { FC } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { RouterSwitch } from '../RouterSwitch'
import { Container } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { PageBreadcrumbs } from '../components/page-breadcrumbs/PageBreadcrumbs'
import { PageTitle } from '../components/page-title/PageTitle'
import { useLayoutStyles } from './styles'


export const Layout: FC = ((props) => {

  const classes = useLayoutStyles()

  return (
    <main className={classes.body}>
      <Header/>
      <Container maxWidth="lg" className={classes.container}>
        <PageTitle/>
        <PageBreadcrumbs/>
        <RouterSwitch/>
        <PageBreadcrumbs/>
      </Container>
      <Footer/>
    </main>
  )
})

