import { FC } from 'react'
import { ListItem, ListSubheader } from '@material-ui/core'
import { useStyles } from './styles'
import { useFormatMessage } from '../../../hooks/use-format-message.hook'

interface Props {
  sticky?: boolean
}

export const BoardListHead: FC<Props> = (props) => {
  const classes = useStyles()
  const t = useFormatMessage()

  return (
    <ListSubheader className={classes.head} disableSticky={!props.sticky}>
      <div className={classes.columnTitle}>{t('BoardListHead:column.title')}</div>
      <div className={classes.columnTopicCount}>{t('BoardListHead:column.topic-count')}</div>
      <div className={classes.columnMessageCount}>{t('BoardListHead:column.message-count')}</div>
      <div className={classes.columnLast}>{t('BoardListHead:column.last')}</div>
    </ListSubheader>
  )
}
