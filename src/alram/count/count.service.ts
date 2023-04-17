import { Injectable } from '@nestjs/common';
import { CreateCountDto } from './dto/create-count.dto';
import { UpdateCountDto } from './dto/update-count.dto';

@Injectable()
export class CountService {
  create(createCountDto: CreateCountDto) {
    return 'This action adds a new count';
  }

  findAll() {
    return `This action returns all count`;
  }

  findOne(id: number) {
    return `This action returns a #${id} count`;
  }

  update(id: number, updateCountDto: UpdateCountDto) {
    return `This action updates a #${id} count`;
  }

  remove(id: number) {
    return `This action removes a #${id} count`;
  }
}
