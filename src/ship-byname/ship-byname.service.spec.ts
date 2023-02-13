import { Test, TestingModule } from "@nestjs/testing";
import { ShipBynameService } from "./ship-byname.service";

describe("ShipBynameService", () => {
  let service: ShipBynameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipBynameService],
    }).compile();

    service = module.get<ShipBynameService>(ShipBynameService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
