import { Injectable } from '@nestjs/common';
import { CreateBerthInfoDto } from './dto/create-berth-info.dto';
import { UpdateBerthInfoDto } from './dto/update-berth-info.dto';

@Injectable()
export class BerthInfoService {
  create(createBerthInfoDto: CreateBerthInfoDto) {
    return 'This action adds a new berthInfo';
  }

  findAll() {
    return `This action returns all berthInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} berthInfo`;
  }

  update(id: number, updateBerthInfoDto: UpdateBerthInfoDto) {
    return `This action updates a #${id} berthInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} berthInfo`;
  }
}
