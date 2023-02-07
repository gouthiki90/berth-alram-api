import { Test, TestingModule } from '@nestjs/testing';
import { CommonScheduleController } from './common-schedule.controller';
import { CommonScheduleService } from './common-schedule.service';

describe('CommonScheduleController', () => {
  let controller: CommonScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonScheduleController],
      providers: [CommonScheduleService],
    }).compile();

    controller = module.get<CommonScheduleController>(CommonScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
