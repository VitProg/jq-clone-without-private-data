import { CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core'
import { render } from 'react-dom'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
import { Layout } from './layout/Lyout'
import { GlobalStyle } from './GlobalStyle'
import { IocProvider } from './ioc/ioc.react'
import { container } from './ioc/ioc.container'
import { AuthServiceSymbol, ForumServiceSymbol } from './services/ioc.symbols'
import { IAuthService } from './services/my/types'
import { IForumService } from './services/forum/types'


import { store } from './store'
import './Tags'
import './ioc'
import { observer } from 'mobx-react-lite'
import './utils/date'

// @ts-ignore
import messagesRu from './ru.json'

const authService = container.get<IAuthService>(AuthServiceSymbol)

authService.refreshToken(true)
  .finally(() => {
    const App = observer(function App () {
      const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
      store.uiStore.setDarkMode(prefersDarkMode)

      container.get<IForumService>(ForumServiceSymbol)

      const cache = createIntlCache()

      // todo - save to store
      const intl = createIntl(
        {
          locale: 'ru',
          defaultLocale: 'en',
          messages: messagesRu,
        },
        cache
      )

      return (
        <IocProvider container={container}>
          <ThemeProvider theme={store.uiStore.theme}>
            <RawIntlProvider value={intl}>
              <CssBaseline/>
              <GlobalStyle/>
              <Layout/>
            </RawIntlProvider>
          </ThemeProvider>
        </IocProvider>
      )
    })

    render(<App/>, document.getElementById('app'))
  })
