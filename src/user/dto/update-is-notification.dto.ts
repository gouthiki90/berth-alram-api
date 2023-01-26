import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateIsNotificationDto {
  /** 유저 키값 */
  oid?: string;
  /** 문자 on-off */
  isNofitication?: number;
}
