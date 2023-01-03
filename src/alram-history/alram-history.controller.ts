import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
} from "@nestjs/common";
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

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.alramHistoryService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAlramHistoryDto: UpdateAlramHistoryDto
  ) {
    return this.alramHistoryService.update(+id, updateAlramHistoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.alramHistoryService.remove(+id);
  }
}
