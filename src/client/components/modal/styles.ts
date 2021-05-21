import { makeStyles, Theme } from '@material-ui/core'

type Colors = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'grey'

export interface StyleProps {
  headerColor: Colors
}

const toColor = (color: Colors, theme: Theme): string => {
  if (['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(color)) {
    return (theme.palette[color] as any).main
  }
  return theme.palette.grey['300']
}

export const useModalStyles = makeStyles((theme: Theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    outline: 'none',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    outline: 'none',
  },
  header: {
    width: '100%',
    padding: theme.spacing(3, 4),
    display: 'flex',
    position: 'relative',
    backgroundColor: (props: StyleProps) => toColor(props.headerColor, theme),
    color: (props: StyleProps) => theme.palette.getContrastText(toColor(props.headerColor, theme)),

    '& > *': {
      color: (props: StyleProps) => theme.palette.getContrastText(toColor(props.headerColor, theme)),
    },

    '& > *:first-child': {
      flex: '2',
    },
    '& > *:last-child': {
      top: '50%',
      right: '.5em',
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
  },
  headerClose: {

  },
  content: {
    width: '100%',
    padding: theme.spacing(3, 4),
  },
  footer: {
    width: '100%',
    padding: theme.spacing(3, 4),
  }
}))
