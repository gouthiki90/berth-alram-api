import { Module } from "@nestjs/common";
import { BerthInfoService } from "./berth-info.service";
import { BerthInfoController } from "./berth-info.controller";
import { BerthInfoRepository } from "./berth-info.repository";
import { Utils } from "src/util/common.utils";
import { SequelizeModule } from "@nestjs/sequelize";
import { berthInfo } from "src/models";

@Module({
  imports: [SequelizeModule.forFeature([berthInfo])],
  controllers: [BerthInfoController],
  providers: [BerthInfoService, BerthInfoRepository, Utils],
})
export class BerthInfoModule {}
