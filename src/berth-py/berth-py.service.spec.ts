import { Test, TestingModule } from "@nestjs/testing";
import { BerthPyService } from "./berth-py.service";

describe("BerthPyService", () => {
  let service: BerthPyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BerthPyService],
    }).compile();

    service = module.get<BerthPyService>(BerthPyService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
