import { PartialType } from '@nestjs/mapped-types';
import { CreateCommonScheduleDto } from './create-common-schedule.dto';

export class UpdateCommonScheduleDto extends PartialType(CreateCommonScheduleDto) {}
