import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateAlramHistoryDto {
  historyOid?: string;
  isRead?: number;
}
