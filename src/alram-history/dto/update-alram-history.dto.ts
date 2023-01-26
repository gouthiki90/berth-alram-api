import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateAlramHistoryDto {
  /** 알람 히스토리 키값 */
  oid?: Array<string>;
  /** 읽음/안읽음 상태값 */
  isRead?: number;
}
