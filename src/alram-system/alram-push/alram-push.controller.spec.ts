import { Test, TestingModule } from '@nestjs/testing';
import { AlramPushController } from './alram-push.controller';
import { AlramPushService } from './alram-push.service';

describe('AlramPushController', () => {
  let controller: AlramPushController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlramPushController],
      providers: [AlramPushService],
    }).compile();

    controller = module.get<AlramPushController>(AlramPushController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
