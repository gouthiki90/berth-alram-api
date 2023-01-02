import { Module } from '@nestjs/common';
import { BerthInfoService } from './berth-info.service';
import { BerthInfoController } from './berth-info.controller';

@Module({
  controllers: [BerthInfoController],
  providers: [BerthInfoService]
})
export class BerthInfoModule {}
