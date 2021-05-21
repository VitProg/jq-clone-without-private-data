import { FC } from 'react'
import { MessageList } from '../components/message/message-list/MessageList'
import { observer } from 'mobx-react-lite'
import { Container } from '@material-ui/core'
import { routes } from '../routing'
import { store } from '../store'
import { usePage } from '../hooks/use-page'
import { useRoutePagination } from '../hooks/use-route-pagination'


interface Props {
  page?: number
}

export const LastMessageListPage: FC<Props> = observer(function LastMessageListPage (props: Props) {
  const [page] = usePage(props.page ?? 1)

  store.seoStore.setTitle('Последние сообщения')
  store.uiStore.setPageTitle('Последние сообщения')
  store.breadcrumbsStore.set({route: 'lastMessages', label: 'Последние сообщения'})

  const pageData = store.forumStore.messageStore.getPage({
    page,
    type: 'latest',
  })

  const pageMeta = store.forumStore.messageStore.getPageMeta({
    type: 'latest',
  })

  const pagination = useRoutePagination(
    p => routes.lastMessages({ page: p.page }),
    page,
    pageData?.meta,
    pageMeta,
    store.uiStore.loading
  )

  if (pagination.currentPage) {
    store.seoStore.addTitle(`Страница: ${pagination.currentPage}`)
    store.breadcrumbsStore.add(pagination.totalPages ?
      `${page} из ${pagination.totalPages}` :
      pagination.currentPage.toString()
    )
  }

  return (
    <Container>
      {pagination.component}
      <MessageList
        messages={store.uiStore.loading ? undefined : pageData?.items}
        itemProps={{
          breadcrumb: true,
        }}
      />
      {pagination.component}
    </Container>
  )
})
