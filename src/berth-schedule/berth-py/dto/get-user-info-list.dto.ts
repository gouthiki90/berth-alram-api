export class GetUserInfoListDto {
  /** 유저 키값 */
  userOid?: string;
  /** 유저 연락처 */
  contact?: string;
  /** 유저 연락처 10개 */
  contact_01?: string;
  contact_02?: string;
  contact_03?: string;
  contact_04?: string;
  contact_05?: string;
  contact_06?: string;
  contact_07?: string;
  contact_08?: string;
  contact_09?: string;
  /** 알람 oid */
  alramOid?: string;
  /** 문자 on-off 옵션 */
  isNofitication?: number;
  /** 유저가 지정한 모선명 별칭 */
  nickname_01?: string;
  /** 별칭 사용 여부 */
  isUse?: number;
}
