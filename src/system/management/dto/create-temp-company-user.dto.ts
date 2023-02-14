import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateTempCompanyUserDto {
  /** 유저 키값 */
  oid?: string;
  /** 유저 아이디 */
  userId?: string;
  /** 패스워드 */
  password?: any;
  /** 회사 그룹 코드 */
  companyGroupCode?: string;
  /** 대표명 */
  principal?: string;
  /** 회사명 */
  bizName?: string;
}
