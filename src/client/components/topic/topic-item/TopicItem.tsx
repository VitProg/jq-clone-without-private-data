import { ITopicEx } from '../../../../common/forum/forum.ex.interfaces'
import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { ListItem, ListItemText } from '@material-ui/core'
import { RouteLink } from '../../route/RouteLink'
import { toJS } from 'mobx'


interface Props {
  topic: ITopicEx
  loading?: boolean
}

export const TopicItem: FC<Props> = observer(function TopicItem (props) {

  const routeProps = { topic: toJS(props.topic) }

  const countMessages = props.topic.counters?.message

  return (
    <ListItem key={props.topic.id}>
      <ListItemText
        primary={<RouteLink to={'topicMessageList'} route={routeProps}>{props.topic.subject}</RouteLink>}
        secondary={
          <>
            { countMessages ? `messages: ${countMessages}` : '' }
            {JSON.stringify(props.topic)}
          </>}
      />
    </ListItem>
  )
})
