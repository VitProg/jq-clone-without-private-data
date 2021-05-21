import { Test, TestingModule } from '@nestjs/testing';
import { MessageRedisService } from '../message-redis.service';

describe('MessageRedisService', () => {
  let service: MessageRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageRedisService],
    }).compile();

    service = module.get<MessageRedisService>(MessageRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
