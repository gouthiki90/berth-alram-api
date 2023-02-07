import { Module } from "@nestjs/common";
import { CommonScheduleService } from "./common-schedule.service";
import { CommonScheduleController } from "./common-schedule.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { berthStatSchedule } from "src/models";
import { Utils } from "src/util/common.utils";
import { CommonScheduleRepository } from "./common-schedule.repository";

@Module({
  imports: [SequelizeModule.forFeature([berthStatSchedule])],
  controllers: [CommonScheduleController],
  providers: [CommonScheduleService, CommonScheduleRepository, Utils],
})
export class CommonScheduleModule {}
