import { IUIStore } from './types'
import { action, makeObservable, observable } from 'mobx'
import { createMuiTheme, Theme } from '@material-ui/core'
import { ReactNode } from 'react'
import { theme } from '../theme'


export class UIStore implements IUIStore {
  constructor () {
    makeObservable(this)
  }

  @observable
  loading = false

  @observable.ref
  theme: Theme = theme

  @observable
  darkMode = !!(localStorage.getItem('dark-mode') ?? false)

  @action.bound
  setDarkMode (value: boolean): void {
    if (this.darkMode !== value) {
      this.darkMode = value
      localStorage.setItem('dark-mode', value ? '1' : '')

      this.theme = createMuiTheme({
        ...this.theme,
        palette: {
          ...this.theme.palette,
          type: this.darkMode ? 'dark' : 'light'
        }
      })
    }
  }

  @action.bound
  setLoading (value: boolean): void {
    this.loading = value
  }


  @observable
  pageTitle: string | ReactNode | undefined = undefined

  @action.bound
  clearPageTitle (): void {
    this.pageTitle = undefined
  }

  @action.bound
  setPageTitle (title: string | ReactNode | undefined): void {
    this.pageTitle = title
  }

}
