export class OffsetAlramDto {
  /** 알람 키값 */
  oid?: string;
  /** 유저 연결값 */
  userOid?: string;
  /** 선석 데이터 연결값 */
  scheduleOid?: string;
  /** 제목 */
  title?: string;
  /** 내용 */
  content?: string;
}
