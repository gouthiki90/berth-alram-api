export class GetUserInfoListDto {
  /** 유저 키값 */
  userOid?: string;
  /** 유저 연락처 */
  contact?: string;
  /** 유저 연락처 2 */
  contact_01?: string;
  /** 알람 oid */
  alramOid?: string;
  /** 문자 on-off 옵션 */
  isNofitication?: number;
  /** 유저가 지정한 모선명 별칭 */
  nickname_01?: string;
}
