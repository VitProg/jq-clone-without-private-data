import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles/withStyles/withStyles'
import { gridLg, gridMd, gridSm, gridXs } from '../constants'


export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      head: {
        display: 'grid',

        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),

        borderBottom: `1px solid ${theme.palette.divider}`,

        '& > *': {
          ...theme.typography.body2,
          textTransform: 'uppercase',
        },

        [theme.breakpoints.up('lg')]: {
          ...gridLg(theme),
        },

        [theme.breakpoints.only('md')]: {
          ...gridMd(theme),
        },

        [theme.breakpoints.down('sm')]: {
          display: 'none'
        },

        backgroundColor: theme.palette.background.paper,

        alignItems: 'center',
      } as CSSProperties,

      columnTitle: {
        gridArea: 'title'
      } as CSSProperties,

      columnTopicCount: {
        gridArea: 'post-count',
        textAlign: 'center',
      } as CSSProperties,

      columnMessageCount: {
        gridArea: 'message-count',
        textAlign: 'center',
      } as CSSProperties,

      columnLast: {
        gridArea: 'last',
        textAlign: 'right',
      } as CSSProperties,
    }
  ))
