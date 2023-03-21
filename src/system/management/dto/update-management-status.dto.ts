import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateUserStatusManagementDto {
  /** 유저 키값 */
  oid?: string;
  /** 사용/중지 status */
  status?: string;
  /** 사용으로 바꿀 지 중지로 바꿀 지에 대한 code */
  code?: number;
}
