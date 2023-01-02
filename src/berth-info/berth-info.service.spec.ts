import { Test, TestingModule } from '@nestjs/testing';
import { BerthInfoService } from './berth-info.service';

describe('BerthInfoService', () => {
  let service: BerthInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BerthInfoService],
    }).compile();

    service = module.get<BerthInfoService>(BerthInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
