import { Module } from '@nestjs/common';
import { ShippingTimeService } from './shipping-time.service';
import { ShippingTimeController } from './shipping-time.controller';

@Module({
  controllers: [ShippingTimeController],
  providers: [ShippingTimeService]
})
export class ShippingTimeModule {}
