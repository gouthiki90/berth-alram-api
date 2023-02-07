import { Injectable } from '@nestjs/common';
import { CreateCommonScheduleDto } from './dto/create-common-schedule.dto';
import { UpdateCommonScheduleDto } from './dto/update-common-schedule.dto';

@Injectable()
export class CommonScheduleService {
  create(createCommonScheduleDto: CreateCommonScheduleDto) {
    return 'This action adds a new commonSchedule';
  }

  findAll() {
    return `This action returns all commonSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commonSchedule`;
  }

  update(id: number, updateCommonScheduleDto: UpdateCommonScheduleDto) {
    return `This action updates a #${id} commonSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} commonSchedule`;
  }
}
