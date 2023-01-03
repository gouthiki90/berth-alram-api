import { Injectable } from '@nestjs/common';
import { CreateAlramHistoryDto } from './dto/create-alram-history.dto';
import { UpdateAlramHistoryDto } from './dto/update-alram-history.dto';

@Injectable()
export class AlramHistoryService {
  create(createAlramHistoryDto: CreateAlramHistoryDto) {
    return 'This action adds a new alramHistory';
  }

  findAll() {
    return `This action returns all alramHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alramHistory`;
  }

  update(id: number, updateAlramHistoryDto: UpdateAlramHistoryDto) {
    return `This action updates a #${id} alramHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} alramHistory`;
  }
}
