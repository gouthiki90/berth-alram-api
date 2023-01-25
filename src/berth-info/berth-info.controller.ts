import { Controller, Get, UseFilters, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ErrorHandler } from "src/error-handler/error-handler";
import { BerthInfoRepository } from "./berth-info.repository";
import { BerthInfoService } from "./berth-info.service";

@UseGuards(JwtAuthGuard)
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
