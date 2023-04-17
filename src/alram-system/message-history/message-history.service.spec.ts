import { Test, TestingModule } from '@nestjs/testing';
import { MessageHistoryService } from './message-history.service';

describe('MessageHistoryService', () => {
  let service: MessageHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageHistoryService],
    }).compile();

    service = module.get<MessageHistoryService>(MessageHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
