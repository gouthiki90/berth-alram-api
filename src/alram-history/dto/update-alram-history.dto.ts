import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateAlramHistoryDto {
  oid?: Array<string>;
  isRead?: number;
}
