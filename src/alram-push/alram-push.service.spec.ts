import { Test, TestingModule } from "@nestjs/testing";
import { AlramPushService } from "./alram-push.service";

describe("AlramPushService", () => {
  let service: AlramPushService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlramPushService],
    }).compile();

    service = module.get<AlramPushService>(AlramPushService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
