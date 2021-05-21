import { createStyles, makeStyles, Theme } from '@material-ui/core'


export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.grey['100'],
      borderRadius: theme.shape.borderRadius,
      borderLeftWidth: theme.spacing(.5),
      borderLeftStyle: 'solid',
      borderLeftColor: theme.palette.grey['200'],
      // boxShadow: theme.shadows[2],
      padding: theme.spacing(1, 1.5),
      margin: theme.spacing(2, 0),
      ...theme.typography.body2,
      width: '99%',
      cursor: 'pointer',
      position: 'relative',
    },
    icon: {
      color: theme.palette.grey['300'],
      zIndex: 0,
      fontSize: '2em',
      position: 'absolute',
      right: '8px',
      top: '6px',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      width: '100%'
    }
  })
)

