import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateShipBynameDto {
  /** 키값 */
  oid?: string;
  /** 유저 키값 */
  userOid?: string;
  /** 알람 구독 키값 */
  alramOid?: string;
  /** 스케줄 키값 */
  scheduleOid?: string;
  /** 별칭1 */
  nickname_01?: string;
  /** 별칭2 */
  nickname_02?: string;
  /** 별칭3 */
  nickname_03?: string;
  /** 사용여부 */
  isUse?: number;
}
