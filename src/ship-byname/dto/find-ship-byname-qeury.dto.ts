import { Injectable } from "@nestjs/common";

@Injectable()
export class FindShipBynameQueryDto {
  /** 선석 스케줄 키값 */
  scheduleOid?: string;
  /** 알람 구독 키값 */
  alramOid?: string;
  /** 유저 키값 */
  userOid?: string;
}
