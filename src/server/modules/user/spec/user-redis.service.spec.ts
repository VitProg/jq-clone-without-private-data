import { Test, TestingModule } from '@nestjs/testing';
import { UserRedisService } from '../user-redis.service';

describe('UserRedisService', () => {
  let service: UserRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRedisService],
    }).compile();

    service = module.get<UserRedisService>(UserRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
