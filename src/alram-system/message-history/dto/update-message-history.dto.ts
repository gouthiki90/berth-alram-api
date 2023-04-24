import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageHistoryDto } from './create-message-history.dto';

export class UpdateMessageHistoryDto extends PartialType(CreateMessageHistoryDto) {}
