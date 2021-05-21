import { createStyles, makeStyles, Theme } from '@material-ui/core'


export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    iconLink: {
      display: 'flex',
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: theme.spacing(2),
      height: theme.spacing(2),
    },
    item: {
    },
    breadcrumbs: {
      '& > ol > li': {
        maxWidth: '40vw',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        display: 'inline-block',
      }
    }
  }),
);
