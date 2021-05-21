import { Test, TestingModule } from '@nestjs/testing';
import { TopicRedisService } from '../topic-redis.service';

describe('TopicRedisService', () => {
  let service: TopicRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicRedisService],
    }).compile();

    service = module.get<TopicRedisService>(TopicRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
