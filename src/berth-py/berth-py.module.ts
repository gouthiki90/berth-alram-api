import { Module } from "@nestjs/common";
import { BerthPyService } from "./berth-py.service";
import { BerthPyController } from "./berth-py.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { berthStatSchedule } from "src/models";
import { Utils } from "src/util/common.utils";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [SequelizeModule.forFeature([berthStatSchedule]), HttpModule],
  controllers: [BerthPyController],
  providers: [BerthPyService, Utils],
})
export class BerthPyModule {}
