import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { Box, Container, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { RouteLink } from '../components/route/RouteLink'
import { routes } from '../routing'
import { useRoutePagination } from '../hooks/use-route-pagination'
import { store } from '../store'
import { usePageMetadata } from '../hooks/use-page-metadata'
import { ITopicEx } from '../../common/forum/forum.ex.interfaces'
import { GetRoute } from '../routing/types'
import { toJS } from 'mobx'
import { TopicList } from '../components/topic/topic-list/TopicList'


type Props = { route: GetRoute<'boardTopicList'> }//RoutePageProps<'boardTopicList'>

export const BoardTopicList: FC<Props> = observer(function BoardTopicList ({ route }) {
  console.log('BoardTopicList render', route.href, toJS(route))
  const pageProps = store.routeDataStore.getPageProps(route)



  // const [page] = usePage(props.page ?? 1)
  console.log('!!! BoardTopicList render', pageProps)
  const isLoading = pageProps.status === 'pending'
  const isError = pageProps.status === 'error'

  // const board = store.forumStore.boardStore.get(props.board.id)
  const board = pageProps.data?.board
  const page = pageProps.data?.page ?? pageProps.data?.page ?? 1

  // specifyCurrentRoute(!!board, 'boardTopicList', { board, page })

  // const pageData = store.forumStore.topicStore.getPage({
  //   page,
  //   type: 'board',
  //   board: props.board.id,
  // })
  //
  // const pageMeta = store.forumStore.topicStore.getPageMeta({
  //   type: 'board',
  //   board: props.board.id,
  // })

  const pageData = pageProps.data?.pageData
  const pageMeta = pageProps.data?.pageMeta
  const routeProps = ({ board: toJS(pageProps.board) })

  const pagination = useRoutePagination(
    p => routes.boardTopicList({ ...routeProps, page: p.page }),
    page,
    pageData?.meta,
    pageMeta,
    store.uiStore.loading
  )

  usePageMetadata({
    title: board?.name,
    pagination,
  })

  const has = !!pageData?.items?.length

  return (
    <Box>
      {board && <>
        {/*<Typography variant="h5" component="h1">{board.name}</Typography>*/}
        {board.description && <Typography variant="subtitle1" component="div">{board.description}</Typography>}
      </>}

      {has && (
        <>
          {pagination.component}
          <TopicList topics={pageData!.items}/>
          {pagination.component}
        </>
      )}
    </Box>
  )
})
