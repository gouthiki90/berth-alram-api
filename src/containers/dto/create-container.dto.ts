import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateContainerDto {
  /** 컨테이너 키값 */
  oid?: string;
  /** 스케줄 키 */
  berthOid?: string;
  /** 유저 키값 */
  userOid?: string;
  /** 알람 oid */
  alramOid?: string;
  /** 반입 상태값 */
  containerStatus?: number;
  /** 컨테이너 넘버 */
  containerNumnber?: string;
  /** 위험/일반 상태값 */
  isDanger?: number;
}
