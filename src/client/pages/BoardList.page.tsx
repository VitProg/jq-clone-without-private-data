import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { Box, Container } from '@material-ui/core'
import { usePageMetadata } from '../hooks/use-page-metadata'
import { BoardList } from '../components/board/board-list/BoardList'
import { GetRoute } from '../routing/types'
import { store } from '../store'
import { useFormatMessage } from '../hooks/use-format-message.hook'


type Props = { route: GetRoute<'boardList'> }

export const BoardListPage: FC<Props> = observer(function BoardListPage ({route}) {
  const pageProps = store.routeDataStore.getPageProps(route)
  const categories = store.forumStore.categoryStore.getAll(true)

  const t = useFormatMessage()

  usePageMetadata({
    pageTitle: t('BoardListPage:page-title'),
    setSeoTitle: false,
    setBreadcrumbs: false,
  })

  return (
    <Box>
      {pageProps && <BoardList
        boards={pageProps.data?.boards}
        loading={pageProps.status === 'pending'}
        showCategories
        categories={categories}
        showHeads
      />}
    </Box>
  )
})
