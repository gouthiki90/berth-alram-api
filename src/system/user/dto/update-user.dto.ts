import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  /** 유저 키값 */
  oid?: string;
  /** 유저 아이디 */
  userId: string;
  /** 유저 이름 */
  userName?: string;
  /** 상호 */
  bizName: string;
  /** 전화번호 */
  contact?: string;
  /** 연락처 2 */
  contact_01?: string;
  contact_02?: string;
  contact_03?: string;
  contact_04?: string;
  contact_05?: string;
  contact_06?: string;
  contact_07?: string;
  contact_08?: string;
  contact_09?: string;
  /** 담당자 전화번호 */
  managerTel?: string;
  /** 담당자 이름 */
  managerName?: string;
  /** 카톡/문자 옵션 */
  contact_option?: number;
  /** 문자 on-off 옵션 */
  isNofitication?: number;
}
