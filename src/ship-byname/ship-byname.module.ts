import { Module } from "@nestjs/common";
import { ShipBynameService } from "./ship-byname.service";
import { ShipBynameController } from "./ship-byname.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { shipByname, user } from "src/models";

@Module({
  imports: [SequelizeModule.forFeature([user, shipByname])],
  controllers: [ShipBynameController],
  providers: [ShipBynameService],
})
export class ShipBynameModule {}
