import { Test, TestingModule } from '@nestjs/testing';
import { AlramHistoryController } from './alram-history.controller';
import { AlramHistoryService } from './alram-history.service';

describe('AlramHistoryController', () => {
  let controller: AlramHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlramHistoryController],
      providers: [AlramHistoryService],
    }).compile();

    controller = module.get<AlramHistoryController>(AlramHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
