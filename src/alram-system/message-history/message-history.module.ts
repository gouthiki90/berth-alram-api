import { Module } from '@nestjs/common';
import { MessageHistoryService } from './message-history.service';
import { MessageHistoryController } from './message-history.controller';

@Module({
  controllers: [MessageHistoryController],
  providers: [MessageHistoryService]
})
export class MessageHistoryModule {}
