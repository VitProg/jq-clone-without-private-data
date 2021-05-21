import { createStyles, makeStyles, StyleRules, Theme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles/withStyles/withStyles'
import { gridLg, gridMd, gridSm, gridXs } from '../constants'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'


const columnCount = (theme: Theme, down: Breakpoint, up?: Breakpoint) => ({
  color: theme.palette.text.secondary,
  [theme.breakpoints.down(down)]: {
    display: 'none',
  },
  ...(up ?
      {
        [theme.breakpoints.up(up)]: {
          display: 'none',
        }
      } :
      {}
  ),
})

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      '& > *': {
        // outline: '1px dashed red',
        padding: theme.spacing(1, 0),
      },

      display: 'grid',
      position: 'relative',

      [theme.breakpoints.up('lg')]: {
        ...gridLg(theme),
      },

      [theme.breakpoints.only('md')]: {
        ...gridMd(theme),
      },

      [theme.breakpoints.only('sm')]: {
        ...gridSm(theme),
        borderBottom: `1px solid ${theme.palette.divider}`,
        alignItems: 'start',
      },

      [theme.breakpoints.down('xs')]: {
        ...gridXs(theme),
        borderBottom: `1px solid ${theme.palette.divider}`,
      },

      alignItems: 'center',

      [theme.breakpoints.up('sm')]: {
        '&:hover, &:focus': {
          backgroundColor: theme.palette.grey[100],
        },
      }
    },

    columnTitle: {
      gridArea: 'title',
    } as CSSProperties,

    columnCount: {
      gridArea: 'count',
      ...columnCount(theme, 'xs', 'md'),
      paddingBottom: 0,
      textAlign: 'right',
    } as CSSProperties,

    columnTopicCount: {
      gridArea: 'post-count',
      textAlign: 'center',
      ...theme.typography.body1,
      ...columnCount(theme, 'sm'),
    } as CSSProperties,

    columnMessageCount: {
      gridArea: 'message-count',
      textAlign: 'center',
      ...theme.typography.body1,
      ...columnCount(theme, 'sm'),
    } as CSSProperties,

    columnLast: {
      gridArea: 'last',
      textAlign: 'right',
      [theme.breakpoints.between('sm', 'md')]: {
        paddingTop: 0,
      },
    } as CSSProperties,

    lastUserMessage: {
      fontSize: theme.typography.pxToRem(12),
      opacity: 0.8,
      '& > *:not(:last-child)::after': {
        content: '", "',
      },
    } as CSSProperties,

    lastMessageDate: {
      color: theme.palette.text.secondary,
      display: 'inline-block',
      whiteSpace: 'nowrap',
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        display: 'inline-block',
      },
    } as CSSProperties,

    /////

    lastMessageLink: {
      display: 'inline-block',
      maxWidth: '95%',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      // [theme.breakpoints.down('md')]: {
      //   maxWidth: '60%',
      // },
    } as CSSProperties,


    title: {
      ...(theme.typography.body1),
      [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(18),
      },
    } as CSSProperties,

    description: {
      ...(theme.typography.body2),

      color: theme.palette.text.secondary,

      [theme.breakpoints.down('xs')]: {
        // textAlign: 'justify',
        // textAlignLast: 'start',
        fontSize: theme.typography.pxToRem(14),
      } as CSSProperties,

      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(1),
      }

    } as StyleRules,
  })
)
