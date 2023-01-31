export class GetUserInfoListDto {
  /** 유저 키값 */
  userOid?: string;
  /** 유저 연락처 */
  contact?: string;
  /** 알람 oid */
  alramOid?: string;
  /** 문자 on-off 옵션 */
  isNofitication?: number;
}
