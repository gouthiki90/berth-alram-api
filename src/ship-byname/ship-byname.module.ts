import { Module } from "@nestjs/common";
import { ShipBynameService } from "./ship-byname.service";
import { ShipBynameController } from "./ship-byname.controller";

@Module({
  controllers: [ShipBynameController],
  providers: [ShipBynameService],
})
export class ShipBynameModule {}
