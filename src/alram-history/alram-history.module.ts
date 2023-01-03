import { Module } from '@nestjs/common';
import { AlramHistoryService } from './alram-history.service';
import { AlramHistoryController } from './alram-history.controller';

@Module({
  controllers: [AlramHistoryController],
  providers: [AlramHistoryService]
})
export class AlramHistoryModule {}
