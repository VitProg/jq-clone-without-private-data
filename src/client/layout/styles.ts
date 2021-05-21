import { makeStyles, Theme } from '@material-ui/core'


export const useLayoutStyles = makeStyles((theme: Theme) => (
  {
    body: {
      paddingTop: theme.spacing(11),
      paddingBottom: theme.spacing(10),
      backgroundColor: theme.palette.accent.light,
      [theme.breakpoints.down('sm')]: {
        backgroundColor: theme.palette.background.paper,
        paddingTop: theme.spacing(9),
      }
    },
    container: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      borderRadius: theme.shape.borderRadius,
      // padding: theme.spacing(2, 3),
      // ...theme.mixins.gutters({
        padding: theme.spacing(2, 3),
      // }),

      '& > *:first-child': {
        marginTop: 0,
      },

      '& > *:last-child': {
        marginBottom: 0,
      },

      [theme.breakpoints.down('sm')]: {
        boxShadow: 'none',
        borderRadius: 0,
        // paddingLeft: 0,
        // paddingRight: 0,
      }
    }
  }
))

export const useHeaderStyles = makeStyles((theme: Theme) => (
  {
    container: {

    },
    toolbar: {
      display: 'flex',
    },
    grow: {
      flex: 1
    },
    title: {

    },
    menu: {
      textAlign: 'center'
    },
    userArea: {

    },
  }
))
