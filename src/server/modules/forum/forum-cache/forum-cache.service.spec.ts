import { Test, TestingModule } from '@nestjs/testing';
import { ForumCacheService } from './forum-cache.service';

describe('CacheService', () => {
  let service: ForumCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumCacheService],
    }).compile();

    service = module.get<ForumCacheService>(ForumCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
