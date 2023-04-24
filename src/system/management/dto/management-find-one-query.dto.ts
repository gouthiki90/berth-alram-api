import { Injectable } from "@nestjs/common";

@Injectable()
export class ManagementFindOneQueryDto {
  /** 유저 키값 */
  oid?: string;
  /** 회사 그룹 코드 */
  companyGroupCode?: string;
}
