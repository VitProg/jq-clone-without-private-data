import { makeStyles, Theme } from '@material-ui/core'
import { authModalStyles } from '../constants'


export const useStyles = makeStyles((theme: Theme) => ({
  modalPaper: {
    ...authModalStyles(theme),
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(0, 0, 2),
  },
}))
