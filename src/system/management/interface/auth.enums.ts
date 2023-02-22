export enum AuthCode {
  /** 슈퍼 관리자 */
  SUPER = "0authCode_super",
  /** 회사 관리자 */
  MANAGEMENT = "0authCode_management",
  /** 회사 직원 */
  EMPLOYEE = "0authCode_employee",
}

export enum UserStatus {
  /** 사용 중 */
  USE = "0aply_using",
  /** 사용 중지 */
  CLOSE = "0aply_close",
}
