import { Test, TestingModule } from "@nestjs/testing";
import { ShipBynameController } from "./ship-byname.controller";
import { ShipBynameService } from "./ship-byname.service";

describe("ShipBynameController", () => {
  let controller: ShipBynameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipBynameController],
      providers: [ShipBynameService],
    }).compile();

    controller = module.get<ShipBynameController>(ShipBynameController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
