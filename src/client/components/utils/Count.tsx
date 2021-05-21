import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { useIntl } from 'react-intl'
import { CSSProperties } from '@material-ui/styles/withStyles/withStyles'


interface Props {
  count: number
  messageId: string
  intlNum?: string
  numberPosition?: 'begin' | 'end' | false | null
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      whiteSpace: 'nowrap',
    } as CSSProperties,
    num: {
      color: theme.palette.text.primary,
    },
    text: {
      color: theme.palette.text.secondary,

      [theme.breakpoints.down('xs')]: {
        display: 'none',
      }
    }
  })
)

export const Count = (props: Props) => {
  const {
    messageId,
    count,
    intlNum = 'count',
    numberPosition = 'begin',
  } = props
  const classes = useStyles()
  const intl = useIntl()

  const msg = intl.formatMessage({ id: props.messageId }, { [intlNum]: props.count })

  const needToAddNumber = numberPosition === 'begin' || numberPosition === 'end'

  const formattedNum = needToAddNumber ?
    <span className={classes.num}>{intl.formatNumber(props.count)}</span> :
    null

  return (
    <span className={classes.container}>
      {numberPosition === 'begin' ? formattedNum : null}
      <span className={classes.text}> {msg} </span>
      {numberPosition === 'end' ? formattedNum : null}
    </span>
  )
}
