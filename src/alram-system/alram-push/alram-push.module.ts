import { Module } from "@nestjs/common";
import { AlramPushService } from "./alram-push.service";
import { AlramPushController } from "./alram-push.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { berthInfo, berthStatSchedule, user } from "src/models";
import { HttpModule } from "@nestjs/axios";
import { Utils } from "src/util/common.utils";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    SequelizeModule.forFeature([berthStatSchedule, user, berthInfo]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AlramPushController],
  providers: [AlramPushService, Utils],
})
export class AlramPushModule {}
