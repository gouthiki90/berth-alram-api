import { Module } from "@nestjs/common";
import { ContainersService } from "./containers.service";
import { ContainersController } from "./containers.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { container } from "src/models";
import { Utils } from "src/util/common.utils";
import { HttpModule } from "@nestjs/axios";
import { ContainersReposiotry } from "./containers.repository";

@Module({
  imports: [SequelizeModule.forFeature([container]), HttpModule],
  controllers: [ContainersController],
  providers: [ContainersService, Utils, ContainersReposiotry],
})
export class ContainersModule {}
