import { Test, TestingModule } from '@nestjs/testing';
import { MessageDbService } from '../message-db.service';

describe('MessageDbService', () => {
  let service: MessageDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageDbService],
    }).compile();

    service = module.get<MessageDbService>(MessageDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
