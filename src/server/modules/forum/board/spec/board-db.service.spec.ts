import { Test, TestingModule } from '@nestjs/testing';
import { BoardDbService } from '../board-db.service';

describe('BoardService', () => {
  let service: BoardDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardDbService],
    }).compile();

    service = module.get<BoardDbService>(BoardDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
