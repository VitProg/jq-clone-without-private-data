import { Theme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles/withStyles/withStyles'


export const gridLg = (theme: Theme) => ({
  gridGap: theme.spacing(1),
  gridTemplateAreas: '"title post-count message-count last"',
  gridTemplateColumns: `1fr ${theme.spacing(10)}px ${theme.spacing(10)}px ${theme.spacing(22)}px`,
} as CSSProperties)

export const gridMd = (theme: Theme) => ({
  gridGap: theme.spacing(1),
  gridTemplateAreas: '"title post-count message-count last"',
  gridTemplateColumns: `1fr ${theme.spacing(9)}px ${theme.spacing(9)}px ${theme.spacing(20)}px`,
} as CSSProperties)

export const gridSm = (theme: Theme) => ({
  gridGap: theme.spacing(1),
  gridTemplateColumns: `4fr minmax(220px, 1fr)`,
  gridTemplateAreas: `
        "title count"
        "title last"
      `,
} as CSSProperties)

export const gridXs = (theme: Theme) => ({
  display: 'block',
  paddingLeft: 0,
  paddingRight: 0,
} as CSSProperties)

