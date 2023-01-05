import { Test, TestingModule } from '@nestjs/testing';
import { AlramHistoryService } from './alram-history.service';

describe('AlramHistoryService', () => {
  let service: AlramHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlramHistoryService],
    }).compile();

    service = module.get<AlramHistoryService>(AlramHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
