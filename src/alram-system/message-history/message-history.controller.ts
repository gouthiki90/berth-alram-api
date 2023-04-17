import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageHistoryService } from './message-history.service';
import { CreateMessageHistoryDto } from './dto/create-message-history.dto';
import { UpdateMessageHistoryDto } from './dto/update-message-history.dto';

@Controller('message-history')
export class MessageHistoryController {
  constructor(private readonly messageHistoryService: MessageHistoryService) {}

  @Post()
  create(@Body() createMessageHistoryDto: CreateMessageHistoryDto) {
    return this.messageHistoryService.create(createMessageHistoryDto);
  }

  @Get()
  findAll() {
    return this.messageHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageHistoryDto: UpdateMessageHistoryDto) {
    return this.messageHistoryService.update(+id, updateMessageHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageHistoryService.remove(+id);
  }
}
