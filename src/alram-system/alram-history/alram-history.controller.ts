import {
  Controller,
  Get,
  Body,
  Param,
  UseFilters,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ErrorHandler } from "src/error-handler/error-handler";
import { AlramHistoryRepository } from "./alram-history.repository";
import { AlramHistoryService } from "./alram-history.service";
import { UpdateAlramHistoryDto } from "./dto/update-alram-history.dto";

@UseGuards(JwtAuthGuard)
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

  @Get("/count/:oid")
  findAlramHistoryCount(@Param("oid") oid: string) {
    return this.alramHistoryRepository.findOneAlramHistoryCount(oid);
  }

  @Put("/")
  update(@Body() updateAlramHistoryDto: UpdateAlramHistoryDto) {
    return this.alramHistoryService.update(updateAlramHistoryDto);
  }
}
