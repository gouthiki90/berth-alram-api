export class CreateContainerDto {
  oid?: string;
  /** 스케줄 키 */
  berthOid?: string;
  /** 유저 키값 */
  userOid?: string;
  /** 알람 oid */
  alramOid?: string;
  /** 반입 상태값 */
  containerStatus?: boolean;
  /** 차량번호 */
  carCode?: string;
  /** 터미널 코드 */
  outgateCy?: string;
  /** 컨테이너 번호 */
  cntrNo?: string;
  /** 반출시간 */
  outgateTime?: Date;
  /** 해당 데이터 기준 날짜 */
  statusDt?: string;
  /** 반입/반출 상태 */
  statusNm?: string;
  /** 반입/반출 상태 코드 */
  cntrStatus?: string;
  /** 터미널 이름 */
  terminalName?: string;
  /** 해당 데이터 기준의 시간 */
  statusTm?: string;
}
