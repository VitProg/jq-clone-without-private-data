import { SelectQueryBuilder } from 'typeorm'
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces'
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { isArray, isMap } from '../../../common/type-guards'
import { UnpackPromise } from '../../../common/utils/types'




export async function paginateRawAndEntities<
  T extends any,
  O extends any,
  R extends any,
  MapperFunc extends (entities: T[], raw: R[]) => MapperOut | Promise<MapperOut>,
  MapperOut extends Map<number, O> | Record<number, O> | Array<O>,
> (
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
  mapper: MapperFunc,
): Promise<Omit<Pagination<T>, 'items'> & {items: UnpackPromise<ReturnType<MapperFunc>>}> {
  queryBuilder
    .limit(options.limit)
    .offset((options.page - 1) * options.limit)

  const data = await queryBuilder.getRawAndEntities()
  const totalItems = await queryBuilder.getCount()

  const items = await mapper(data.entities, data.raw)

  const itemCount = isMap(items) ? items.size : (isArray(items) ? items.length : Object.keys(items).length)

  return {
    items,
    meta: {
      totalPages: Math.ceil(totalItems / options.limit),
      currentPage: options.page,
      itemsPerPage: options.limit,
      itemCount,
      totalItems,
    }
  } as any
}
