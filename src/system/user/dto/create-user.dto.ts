export class CreateUserDto {
  /** 유저 키값 */
  oid?: string;
  /** 유저 아이디 */
  userId: string;
  /** 패스워드 */
  password?: any;
  /** 유저 이름 */
  userName?: string;
  /** 상호 */
  bizName: string;
  /** 전화번호 */
  contact?: string;
  /** 연락처 2 */
  contact_01?: string;
  /** 담당자 전화번호 */
  managerTel?: string;
  /** 담당자 이름 */
  managerName?: string;
  /** 카톡/문자 옵션 */
  contact_option?: number;
  /** 문자 on-off 옵션 */
  isNofitication?: number;
  /** 권한 */
  role?: string;
}
