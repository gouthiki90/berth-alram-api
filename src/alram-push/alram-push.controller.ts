import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlramPushService } from './alram-push.service';
import { CreateAlramPushDto } from './dto/create-alram-push.dto';
import { UpdateAlramPushDto } from './dto/update-alram-push.dto';

@Controller('alram-push')
export class AlramPushController {
  constructor(private readonly alramPushService: AlramPushService) {}

  @Post()
  create(@Body() createAlramPushDto: CreateAlramPushDto) {
    return this.alramPushService.create(createAlramPushDto);
  }

  @Get()
  findAll() {
    return this.alramPushService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alramPushService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlramPushDto: UpdateAlramPushDto) {
    return this.alramPushService.update(+id, updateAlramPushDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alramPushService.remove(+id);
  }
}
