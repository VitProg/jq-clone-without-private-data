import { Test, TestingModule } from '@nestjs/testing';
import { TopicDbService } from '../topic-db.service';

describe('TopicDbService', () => {
  let service: TopicDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicDbService],
    }).compile();

    service = module.get<TopicDbService>(TopicDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
