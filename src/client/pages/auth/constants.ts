import { Theme } from '@material-ui/core'


export const authModalStyles = (theme: Theme) => ({
  width: 600,
  minWidth: 400,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    minWidth: '100%',
  }
})
