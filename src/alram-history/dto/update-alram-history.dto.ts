import { PartialType } from '@nestjs/mapped-types';
import { CreateAlramHistoryDto } from './create-alram-history.dto';

export class UpdateAlramHistoryDto extends PartialType(CreateAlramHistoryDto) {}
