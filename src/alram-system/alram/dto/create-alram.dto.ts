export class CreateAlramDto {
  /** 알람 키값 */
  oid?: string;
  /** 유저 키값 */
  userOid?: string;
  /** 스케줄 키값 */
  scheduleOid?: string;
  /** 알람 제목 */
  title?: string;
  /** 알람 내용 */
  content?: string;
}
