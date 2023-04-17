import { Module } from '@nestjs/common';
import { CountService } from './count.service';
import { CountController } from './count.controller';

@Module({
  controllers: [CountController],
  providers: [CountService]
})
export class CountModule {}
