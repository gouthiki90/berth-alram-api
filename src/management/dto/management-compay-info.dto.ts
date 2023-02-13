import { Injectable } from "@nestjs/common";

@Injectable()
export class ManagementCompanyInfoDto {
  /** 유저 키값 */
  oid?: string;
  /** 회사 그룹 코드 */
  compayGroupCode?: string;
  /** 업체명 */
  bizName?: string;
}
