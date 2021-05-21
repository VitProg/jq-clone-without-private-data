import { makeStyles, Theme } from '@material-ui/core'
import { authModalStyles } from '../constants'


export const useStyles = makeStyles((theme: Theme) => ({
  modalPaper: {
    ...authModalStyles(theme),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(0, 0, 2),
  },
}))

