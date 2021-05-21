import { createStyles, makeStyles, Theme } from '@material-ui/core'


export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    left: {

    },
    body: {
      // whiteSpace: 'pre-line',
      wordBreak: 'break-word',
      color: theme.palette.grey['A400'],

      '& img, & iframe, & object, & table': {
        maxWidth: '100%',
      }
    }
  })
)
