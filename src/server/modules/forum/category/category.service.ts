import { CacheInterceptor, CacheTTL, Get, Injectable, Param, UseInterceptors } from '@nestjs/common'
import { IBoard, ICategory } from '../../../../common/forum/forum.base.interfaces'
import { ForumCacheService } from '../forum-cache/forum-cache.service'
import { ApiQuery } from '@nestjs/swagger'

@Injectable()
export class CategoryService {
  constructor (
    private readonly cacheService: ForumCacheService
  ) {
  }

  async findAll (): Promise<ICategory[]> {
    const categoryMap = await this.cacheService.getCategoryMap()
    return [...categoryMap.values()]
  }

  async findOne (id: number): Promise<ICategory | undefined> {
    return (await this.cacheService.getCategoryMap()).get(+id)
  }

  async findByIdsToMap(ids: number[] | Set<number>): Promise<Map<number, ICategory>> {
    const idSet = new Set(ids)
    const boardMap = await this.cacheService.getCategoryMap()

    return new Map<number, ICategory>(
      [...boardMap.entries()]
        .filter(([id]) => idSet.has(id))
    )
  }

  async findByIds(ids: number[] | Set<number>): Promise<ICategory[]> {
    return [...(await this.findByIdsToMap(ids)).values()]
  }

  async findByIdsToRecord(ids: number[] | Set<number>): Promise<Record<number, ICategory>> {
    const map = await this.findByIdsToMap(ids)
    return Object.fromEntries(map.entries())
  }
}
