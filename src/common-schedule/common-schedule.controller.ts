import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommonScheduleService } from './common-schedule.service';
import { CreateCommonScheduleDto } from './dto/create-common-schedule.dto';
import { UpdateCommonScheduleDto } from './dto/update-common-schedule.dto';

@Controller('common-schedule')
export class CommonScheduleController {
  constructor(private readonly commonScheduleService: CommonScheduleService) {}

  @Post()
  create(@Body() createCommonScheduleDto: CreateCommonScheduleDto) {
    return this.commonScheduleService.create(createCommonScheduleDto);
  }

  @Get()
  findAll() {
    return this.commonScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommonScheduleDto: UpdateCommonScheduleDto) {
    return this.commonScheduleService.update(+id, updateCommonScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonScheduleService.remove(+id);
  }
}
