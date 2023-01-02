import { PartialType } from '@nestjs/mapped-types';
import { CreateBerthInfoDto } from './create-berth-info.dto';

export class UpdateBerthInfoDto extends PartialType(CreateBerthInfoDto) {}
