import { FC } from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'
import { RouteLink } from '../../route/RouteLink'
import { ListItem, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { FromNowDate } from '../../ui-kit/from-now-date/FromNowDate'
import { UserLink } from '../../user/UserLink'
import { IBoardEx } from '../../../../common/forum/forum.ex.interfaces'
import { useStyles } from './styles'
import { Count } from '../../utils/Count'
import { toJS } from 'mobx'


interface Props {
  board: IBoardEx
  level?: boolean
}

export const BoardItem: FC<Props> = observer(function BoardItem (props) {
  const board = props.board

  const classes = useStyles()
  const theme = useTheme()
  const screenXS = useMediaQuery(theme.breakpoints.down('xs'))
  const intl = useIntl()

  const lastTopic = board.last.topic
  const lastMessage = board.last.message
  const lastMessagePage = board.last.messagePage
  const lastUser = board.last.user

  return (
    <ListItem className={classes.item}>
      <div className={classes.columnTitle}>
        {<RouteLink className={classes.title} to={'boardTopicList'}
                    route={{ board: { id: board.id, url: board.url } }}>{board.name}</RouteLink>}
        {board.description && <div className={classes.description}>{board.description}</div>}
      </div>

      {
        !screenXS &&
        <div className={classes.columnTopicCount}>
          {board.counters && intl.formatNumber(board.counters.topic)}
        </div>
      }
      {
        !screenXS &&
        <div className={classes.columnMessageCount}>
          {board.counters && intl.formatNumber(board.counters.message)}
        </div>
      }
      {
        !screenXS &&
        <div className={classes.columnCount}>
          {board.counters && <Count count={board.counters.topic} messageId={'Common:topic-count'}/>} / {
          board.counters && <Count count={board.counters.message} messageId={'Common:message-count'}/>}
        </div>
      }

      {
        !screenXS &&
        <div className={classes.columnLast}>
          {
            lastTopic &&
            <RouteLink
              to={'topicMessageList'}
              route={{ topic: { id: lastTopic.id, url: lastTopic.url }, page: lastMessagePage }}
              hash={`msg${lastMessage?.id}`}
              className={classes.lastMessageLink}
            >{lastTopic.subject}</RouteLink>
          }

          <div className={classes.lastUserMessage}>
            {lastUser && <UserLink color={'secondary'} user={toJS(lastUser)} avatar={true}/>}
            {lastMessage && <FromNowDate date={lastMessage.date} className={classes.lastMessageDate}/>}
          </div>
        </div>
      }
    </ListItem>
  )
})
