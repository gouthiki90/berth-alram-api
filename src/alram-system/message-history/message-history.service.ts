import { Injectable } from '@nestjs/common';
import { CreateMessageHistoryDto } from './dto/create-message-history.dto';
import { UpdateMessageHistoryDto } from './dto/update-message-history.dto';

@Injectable()
export class MessageHistoryService {
  create(createMessageHistoryDto: CreateMessageHistoryDto) {
    return 'This action adds a new messageHistory';
  }

  findAll() {
    return `This action returns all messageHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageHistory`;
  }

  update(id: number, updateMessageHistoryDto: UpdateMessageHistoryDto) {
    return `This action updates a #${id} messageHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageHistory`;
  }
}
