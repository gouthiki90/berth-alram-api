import { Controller, Get, UseFilters } from "@nestjs/common";
import { ErrorHandler } from "src/error-handler/error-handler";
import { BerthInfoRepository } from "./berth-info.repository";
import { BerthInfoService } from "./berth-info.service";

@UseFilters(ErrorHandler)
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
