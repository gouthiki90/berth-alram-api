import { Body, Controller, Get, Put, UseFilters } from "@nestjs/common";
import { ErrorHandler } from "src/error-handler/error-handler";
import { BerthInfoRepository } from "./berth-info.repository";
import { BerthInfoService } from "./berth-info.service";
import { EditTimingFromAdminDto } from "./dto/edit-timing-from-user.dto";

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

  @Put("/")
  editTimingFromAdmin(@Body() editTimingFromAdminDto: EditTimingFromAdminDto) {
    return this.berthInfoService.editTiming(editTimingFromAdminDto);
  }
}
