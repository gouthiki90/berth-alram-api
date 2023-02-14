import { Module } from "@nestjs/common";
import { ShipBynameService } from "./ship-byname.service";
import { ShipBynameController } from "./ship-byname.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { shipByname, user } from "src/models";
import { ShipBynameRepository } from "./ship-byname.repository";
import { Utils } from "src/util/common.utils";

@Module({
  imports: [SequelizeModule.forFeature([user, shipByname])],
  controllers: [ShipBynameController],
  providers: [ShipBynameService, ShipBynameRepository, Utils],
})
export class ShipBynameModule {}
