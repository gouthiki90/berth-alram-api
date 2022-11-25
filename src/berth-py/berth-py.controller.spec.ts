import { Test, TestingModule } from '@nestjs/testing';
import { BerthPyController } from './berth-py.controller';
import { BerthPyService } from './berth-py.service';

describe('BerthPyController', () => {
  let controller: BerthPyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BerthPyController],
      providers: [BerthPyService],
    }).compile();

    controller = module.get<BerthPyController>(BerthPyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
