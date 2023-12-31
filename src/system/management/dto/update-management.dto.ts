export class UpdateManagementDto {
  /** 키값 */
  oid: string;
  /** 상호 */
  bizName?: string;
  /** 회사 대표 */
  principal?: string;
  /** 회사 코드 */
  code?: string;
  /** 이메일 */
  email?: string;
  /** 대표 전화 */
  tel?: string;
  /** 유저 제한 수 */
  limitUser?: number;
}
