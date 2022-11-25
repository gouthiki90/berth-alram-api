import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { berthStatSchedule } from "src/models";
import { DashBoardRepository } from "./dashboard.repository";
import { BerthStatDto } from "./dto/berth-state.dto";
import { OffsetPagenatedBerthStateDataDto } from "./dto/offset-pagenated-berth-state-data.dto";
import { Utils } from "src/util/common.utils";

@Module({
  imports: [SequelizeModule.forFeature([berthStatSchedule])],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashBoardRepository,
    Array<BerthStatDto>,
    OffsetPagenatedBerthStateDataDto,
    Utils,
  ],
})
export class DashboardModule {}
