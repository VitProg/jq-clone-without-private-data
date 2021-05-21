import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'


export const getPaginationMeta = (items: any[], totalItems: number, currentPage: number, itemsPerPage: number): IPaginationMeta => ({
  totalPages: Math.ceil(totalItems / itemsPerPage),
  currentPage,
  totalItems,
  itemsPerPage,
  itemCount: items.length,
})

export const getPaginationResponse = <T>(items: T[], totalItems: number, pagination: IPaginationOptions): Pagination<T> => ({
  meta: getPaginationMeta(items, totalItems, pagination.page, pagination.limit),
  items
})


export const toStartStop = (pagination: IPaginationOptions): [start: number, end: number] => {
  const start = (pagination.page - 1) * pagination.limit
  const stop = start + pagination.limit
  return [start, stop]
}
