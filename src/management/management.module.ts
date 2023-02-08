import { Module } from "@nestjs/common";
import { ManagementService } from "./management.service";
import { ManagementController } from "./management.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { user } from "src/models";
import { ManageMentRepository } from "./management.repository";
import { Utils } from "src/util/common.utils";

@Module({
  imports: [SequelizeModule.forFeature([user])],
  controllers: [ManagementController],
  providers: [ManagementService, ManageMentRepository, Utils],
})
export class ManagementModule {}
