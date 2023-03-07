/** 알람 푸쉬 메시지에 필요한 interface */
export interface ForAlramPushMessage {
  /** 터미널 코드 */
  trminlCode?: string;
  /** 모선항차 */
  oid?: string;
  /** 새로운 입항일 */
  newCsdhpPrarnde?: string;
  /** 이전 입항일 */
  oldCsdhpPrarnde?: string;
  /** 별칭 */
  nickname_01?: string;
  /** 별칭 사용여부 */
  isUse?: number;
}
