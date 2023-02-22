import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateCompanyManagementDto {
  /** 유저 키값 */
  oid?: string;
  /** 회사 그룹 코드 */
  companyGroupCode?: string;
  /** 회사 대표자 */
  principal?: string;
  /** 유저 아이디 */
  userId?: string;
  /** 패스워드 */
  password?: any;
  /** 상호 */
  bizName?: string;
  /** 사용 상태 */
  status?: string;
  /** 권한 코드 */
  authCode?: string;
}
