import { FC } from 'react'
import { PaginationProps } from '@material-ui/lab/Pagination/Pagination'
import { Pagination, PaginationItem, PaginationRenderItemParams } from '@material-ui/lab'
import { AppRoute } from '../../routing/types'


type Props = PaginationProps & {
  route: (params: PaginationRenderItemParams) => AppRoute
}

export const RoutePagination: FC<Props> = (props) => {
  const { route, ...paginationProps } = props

  if ((paginationProps?.count ?? 0) <= 1) {
    return null
  }

  const renderItem = (item: PaginationRenderItemParams) => {
    if (item.type === 'end-ellipsis' || item.type === 'start-ellipsis') {
      return (<PaginationItem {...item}/>)
    }

    return (
      <PaginationItem
        {...item}
        component='a'
        {...route(item).link}
      />
    )
  }

  return (
    <Pagination
      shape='rounded'
      size='small'
      {...paginationProps}
      renderItem={renderItem}
    />
  )
}
