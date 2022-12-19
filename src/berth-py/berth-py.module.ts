import { Module } from "@nestjs/common";
import { BerthPyService } from "./berth-py.service";
import { BerthPyController } from "./berth-py.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { berthStatSchedule, user } from "src/models";
import { Utils } from "src/util/common.utils";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    SequelizeModule.forFeature([berthStatSchedule, user]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [BerthPyController],
  providers: [BerthPyService, Utils],
})
export class BerthPyModule {}
