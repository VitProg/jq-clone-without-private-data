import { createStyles, makeStyles, Theme } from '@material-ui/core'


export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      padding: theme.spacing(1, 2),
      boxShadow: theme.shadows[6],
    },
  }),
);
