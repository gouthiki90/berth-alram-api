import { Test, TestingModule } from '@nestjs/testing';
import { CommonScheduleService } from './common-schedule.service';

describe('CommonScheduleService', () => {
  let service: CommonScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonScheduleService],
    }).compile();

    service = module.get<CommonScheduleService>(CommonScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
