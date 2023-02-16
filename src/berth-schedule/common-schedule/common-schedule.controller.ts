import { Controller, Get, Logger, Query } from "@nestjs/common";
import { CommonScheduleRepository } from "./common-schedule.repository";
import { CommonScheduleService } from "./common-schedule.service";

@Controller("common-schedule")
export class CommonScheduleController {
  constructor(
    private readonly commonScheduleService: CommonScheduleService,
    private readonly commonScheduleRepository: CommonScheduleRepository
  ) {}

  @Get("/")
  findAll(@Query() query: any) {
    Logger.warn("::: GET ::: select from another project... :::");
    return this.commonScheduleRepository.findAllScheduleToEverySite(query);
  }
}
