import { IBoardEx, ITopicEx } from '../../../../common/forum/forum.ex.interfaces'
import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { RouteLink } from '../../route/RouteLink'
import { toJS } from 'mobx'
import { TopicItem } from '../topic-item/TopicItem'


interface Props {
  topics?: ITopicEx[]
  loading?: boolean
}

export const TopicList: FC<Props> = observer(function TopicList (props) {

  return (
    <List>
      {!!props.topics && props.topics.map((topic: ITopicEx) => (
        <TopicItem topic={topic}/>
        // <ListItem key={topic.id}>
        //   <ListItemText
        //     primary={<RouteLink to={'topicMessageList'} route={{ topic: toJS(topic) }}>{topic.subject}</RouteLink>}
        //     secondary={topic.counters?.message ? `messages: ${topic.counters?.message}` : ''}
        //   />
        // </ListItem>
      ))}
    </List>
  )
})
