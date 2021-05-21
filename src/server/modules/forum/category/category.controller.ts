import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseInterceptors
} from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { CategoryService } from './category.service'
import { CategoryModel } from '../models/category.model'
import { ApiPipeNumbers } from '../../../swagger/decorators/api-pipe-numbers'
import { splitPipedNumbers, splitPipedStrings } from '../../../../common/utils/string'
import { ParsePipedIntPipe } from '../../../pipes/parse-piped-int.pipe'


const DEVELOPMENT = process.env.NODE_ENV !== 'production'

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor (
    private readonly categoryService: CategoryService
  ) {
  }

  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get()
  async findAll (): Promise<CategoryModel[]> {
    return this.categoryService.findAll()
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get(':id')
  @ApiQuery({ name: 'id', type: Number })
  async findOne (@Param('id', ParseIntPipe) id: number): Promise<CategoryModel | undefined> {
    const item = this.categoryService.findOne(id)
    if (!item) {
      throw new NotFoundException(`Category ${id} not found`)
    }
    return item
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get('many/:ids')
  @ApiPipeNumbers('ids', 'param')
  async findByIds (@Param('ids', ParsePipedIntPipe) ids: number[]): Promise<CategoryModel[]> {
    return this.categoryService.findByIds(ids)
  }
}
