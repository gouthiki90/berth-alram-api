import { Controller, Get, Body, Param, UseFilters, Put } from "@nestjs/common";
import { ErrorHandler } from "src/error-handler/error-handler";
import { AlramHistoryRepository } from "./alram-history.repository";
import { AlramHistoryService } from "./alram-history.service";
import { UpdateAlramHistoryDto } from "./dto/update-alram-history.dto";

@UseFilters(ErrorHandler)
@Controller("alram-history")
export class AlramHistoryController {
  constructor(
    private readonly alramHistoryService: AlramHistoryService,
    private readonly alramHistoryRepository: AlramHistoryRepository
  ) {}

  @Get("/:oid")
  findOne(@Param("oid") oid: string) {
    return this.alramHistoryRepository.findOneOfUserAlramHistory(oid);
  }

  @Get("/history-count/:oid")
  findAlramHistoryCount(@Param("oid") oid: string) {
    return this.alramHistoryRepository.findOneAlramHistoryCount(oid);
  }

  @Put("/")
  update(@Body() updateAlramHistoryDto: UpdateAlramHistoryDto) {
    return this.alramHistoryService.update(updateAlramHistoryDto);
  }
}
