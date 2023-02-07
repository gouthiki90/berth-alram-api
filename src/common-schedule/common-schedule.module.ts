import { Module } from '@nestjs/common';
import { CommonScheduleService } from './common-schedule.service';
import { CommonScheduleController } from './common-schedule.controller';

@Module({
  controllers: [CommonScheduleController],
  providers: [CommonScheduleService]
})
export class CommonScheduleModule {}
