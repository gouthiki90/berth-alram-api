import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlramHistoryService } from './alram-history.service';
import { CreateAlramHistoryDto } from './dto/create-alram-history.dto';
import { UpdateAlramHistoryDto } from './dto/update-alram-history.dto';

@Controller('alram-history')
export class AlramHistoryController {
  constructor(private readonly alramHistoryService: AlramHistoryService) {}

  @Post()
  create(@Body() createAlramHistoryDto: CreateAlramHistoryDto) {
    return this.alramHistoryService.create(createAlramHistoryDto);
  }

  @Get()
  findAll() {
    return this.alramHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alramHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlramHistoryDto: UpdateAlramHistoryDto) {
    return this.alramHistoryService.update(+id, updateAlramHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alramHistoryService.remove(+id);
  }
}
