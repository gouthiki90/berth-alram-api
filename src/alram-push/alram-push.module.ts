import { Module } from "@nestjs/common";
import { AlramPushService } from "./alram-push.service";
import { AlramPushController } from "./alram-push.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { berthStatSchedule, user } from "src/models";
import { HttpModule } from "@nestjs/axios";
import { Utils } from "src/util/common.utils";

@Module({
  imports: [SequelizeModule.forFeature([berthStatSchedule, user]), HttpModule],
  controllers: [AlramPushController],
  providers: [AlramPushService, Utils],
})
export class AlramPushModule {}
