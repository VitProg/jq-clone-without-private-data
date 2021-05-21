import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles/withStyles/withStyles'


export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {

    } as CSSProperties,

    listContainer: {
      marginBottom: theme.spacing(2),
    } as CSSProperties,

    list: {
      flexDirection: 'column',
    } as CSSProperties,

  }
))
