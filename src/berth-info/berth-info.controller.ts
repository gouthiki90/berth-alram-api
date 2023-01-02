import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BerthInfoService } from './berth-info.service';
import { CreateBerthInfoDto } from './dto/create-berth-info.dto';
import { UpdateBerthInfoDto } from './dto/update-berth-info.dto';

@Controller('berth-info')
export class BerthInfoController {
  constructor(private readonly berthInfoService: BerthInfoService) {}

  @Post()
  create(@Body() createBerthInfoDto: CreateBerthInfoDto) {
    return this.berthInfoService.create(createBerthInfoDto);
  }

  @Get()
  findAll() {
    return this.berthInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.berthInfoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBerthInfoDto: UpdateBerthInfoDto) {
    return this.berthInfoService.update(+id, updateBerthInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.berthInfoService.remove(+id);
  }
}
