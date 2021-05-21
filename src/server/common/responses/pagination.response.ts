import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { ApiProperty } from '@nestjs/swagger'


export class PaginationResponse<PaginationObject> implements Pagination<PaginationObject> {

  //  @ApiProperty()
  readonly items!: PaginationObject[];

  @ApiProperty()
  readonly meta!: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }

  @ApiProperty()
  readonly links?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  }
}
