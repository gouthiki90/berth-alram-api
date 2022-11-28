import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ErrorHandler } from "src/error-handler/error-handler";
import { DashBoardRepository } from "./dashboard.repository";
import { DashboardService } from "./dashboard.service";
import { BerthQueryDto } from "./dto/berth-query.dto";
import { OffsetPagingInfoDto } from "./dto/offset-page-info.dto";

@UseGuards(JwtAuthGuard)
@UseFilters(ErrorHandler)
@Controller("dashboard")
export class DashboardController {
  constructor(
    private readonly dashBoardRepository: DashBoardRepository,
    private readonly dashBoardService: DashboardService
  ) {}

  @Get("/")
  findAll() {
    return this.dashBoardRepository.findAll();
  }

  @Get("/:oid")
  findOne(@Param("oid") oid: string) {
    return this.dashBoardRepository.findOne(oid);
  }

  @Post("/page-info")
  findForPageInfo(
    @Body() pageInfo: OffsetPagingInfoDto,
    @Query() query: BerthQueryDto
  ) {
    return this.dashBoardService.makePageInfo(pageInfo, query);
  }
}
