import { Module } from "@nestjs/common";
import { ShippingTimeService } from "./shipping-time.service";
import { ShippingTimeController } from "./shipping-time.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { berthStatSchedule, container, user } from "src/models";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    SequelizeModule.forFeature([user, berthStatSchedule, container]),
    HttpModule,
  ],
  controllers: [ShippingTimeController],
  providers: [ShippingTimeService],
})
export class ShippingTimeModule {}
