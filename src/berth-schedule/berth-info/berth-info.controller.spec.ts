import { Test, TestingModule } from '@nestjs/testing';
import { BerthInfoController } from './berth-info.controller';
import { BerthInfoService } from './berth-info.service';

describe('BerthInfoController', () => {
  let controller: BerthInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BerthInfoController],
      providers: [BerthInfoService],
    }).compile();

    controller = module.get<BerthInfoController>(BerthInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
