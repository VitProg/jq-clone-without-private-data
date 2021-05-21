import { PaginationRenderItemParams } from '@material-ui/lab'
import { AppRoute } from '../routing/types'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import { useMemo } from 'react'
import { RoutePagination } from '../components/route/RoutePagination'


export const useRoutePagination = (
  route: (params: PaginationRenderItemParams) => AppRoute,
  propsPage?: number,
  currentMeta?: IPaginationMeta,
  pageMeta?: Omit<IPaginationMeta, 'currentPage'>,
  isLoading = false,
) => {
  const totalPages = currentMeta?.totalPages ?? pageMeta?.totalPages ?? (propsPage ?? 0) + 1
  const currentPage = isLoading ? propsPage : (currentMeta?.currentPage ?? propsPage ?? 1)

  const component = useMemo(
    () => (
      <RoutePagination
        count={totalPages}
        page={currentPage}
        route={route}
      />
    ),
    [
      totalPages,
      currentPage,
      route,
    ])

  return {
    totalPages,
    currentPage,
    component
  }
}
