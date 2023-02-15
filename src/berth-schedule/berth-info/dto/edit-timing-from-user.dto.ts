import { Injectable } from "@nestjs/common";

@Injectable()
export class EditTimingFromAdminDto {
  /** 사전반입일 */
  carryTiming?: number;
  /** 유저 아이디 */
  userId?: string;
  /** berthInfo 키값 */
  oid?: string;
}
