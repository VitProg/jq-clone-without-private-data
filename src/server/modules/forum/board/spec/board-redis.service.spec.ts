import { Test, TestingModule } from '@nestjs/testing';
import { BoardRedisService } from '../board-redis.service';

describe('BoardRedisService', () => {
  let service: BoardRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardRedisService],
    }).compile();

    service = module.get<BoardRedisService>(BoardRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
