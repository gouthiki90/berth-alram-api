import { Controller, Get } from "@nestjs/common";
import { BerthInfoRepository } from "./berth-info.repository";
import { BerthInfoService } from "./berth-info.service";
@Controller("berth-info")
export class BerthInfoController {
  constructor(
    private readonly berthInfoService: BerthInfoService,
    private readonly berthInfoRepository: BerthInfoRepository
  ) {}

  @Get("/")
  findAll() {
    return this.berthInfoRepository.findAllBerthInfo();
  }
}
