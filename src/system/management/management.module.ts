import { Module } from "@nestjs/common";
import { ManagementService } from "./management.service";
import { ManagementController } from "./management.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { commonCode, stmCompany, user } from "src/models";
import { ManagementRepository } from "./management.repository";
import { Utils } from "src/util/common.utils";

@Module({
  imports: [SequelizeModule.forFeature([user, commonCode, stmCompany])],
  controllers: [ManagementController],
  providers: [ManagementService, ManagementRepository, Utils],
})
export class ManagementModule {}
