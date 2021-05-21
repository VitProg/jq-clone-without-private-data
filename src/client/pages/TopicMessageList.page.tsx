import { FC } from 'react'
import { MessageList } from '../components/message/message-list/MessageList'
import { observer } from 'mobx-react-lite'
import { Container } from '@material-ui/core'
import { routes } from '../routing'
import { store } from '../store'
import { usePage } from '../hooks/use-page'
import { useRoutePagination } from '../hooks/use-route-pagination'
import { usePageMetadata } from '../hooks/use-page-metadata'
import { GetRoute } from '../routing/types'


type Props = { route: GetRoute<'topicMessageList'> }//RoutePageProps<'topicMessageList'>

export const TopicMessageListPage: FC<Props> = observer(function TopicMessageListPage (props: Props) {
  // const [page] = usePage(props.page ?? 1)
  //
  // const topic = store.forumStore.topicStore.get(props.topic.id)
  // const board = topic && store.forumStore.boardStore.get(topic?.boardId)
  //
  // const pageData = store.forumStore.messageStore.getPage({
  //   page,
  //   type: 'topic',
  //   topic: props.topic.id
  // })
  //
  // const pageMeta = store.forumStore.messageStore.getPageMeta({
  //   type: 'topic',
  //   topic: props.topic.id
  // })
  //
  // const pagination = uesRoutePagination(
  //   p => routes.topicMessageList({ topic: props.topic, page: p.page }),
  //   page,
  //   pageData?.meta,
  //   pageMeta,
  //   store.uiStore.loading
  // )
  //
  // usePageMetadata({
  //   title: topic?.subject,
  //   pagination,
  //   routes: [
  //     !!board && [board.name, routes.boardTopicList({ board: board })],
  //     !!topic && [topic.subject, routes.topicMessageList({ topic: topic })],
  //   ],
  // })
  //
  // return (
  //   <Container>
  //     {pagination.component}
  //     <MessageList
  //       messages={store.uiStore.loading ? undefined : pageData?.items}
  //     />
  //     {pagination.component}
  //   </Container>
  // )
  return <div>todo</div>
})
