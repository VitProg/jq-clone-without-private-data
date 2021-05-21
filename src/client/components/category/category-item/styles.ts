import { createStyles, makeStyles, Theme } from '@material-ui/core'



export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      ...(theme.typography.h4),
      margin: 0,
      paddingTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 ${theme.spacing(1)}px ${theme.spacing(3)}px rgba(255, 255, 255, 0.5)`,

      [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  })
)
