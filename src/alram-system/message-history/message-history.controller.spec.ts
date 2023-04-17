import { Test, TestingModule } from '@nestjs/testing';
import { MessageHistoryController } from './message-history.controller';
import { MessageHistoryService } from './message-history.service';

describe('MessageHistoryController', () => {
  let controller: MessageHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageHistoryController],
      providers: [MessageHistoryService],
    }).compile();

    controller = module.get<MessageHistoryController>(MessageHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
