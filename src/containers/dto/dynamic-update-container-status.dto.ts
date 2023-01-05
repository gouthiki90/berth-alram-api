import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicUpdateContainerStatus {
  /** container oid */
  oid?: string;
  /** container status */
  containerStatus?: number;
  /** 컨테이너 일자 */
  STATUS_DT?: string;
  /** 컨테이너 시간 */
  STATUS_TM?: string;
}
