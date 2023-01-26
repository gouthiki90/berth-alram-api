import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicUpdateContainerDangerStatusDto {
  /** 컨테이너 키값 */
  oid?: string;
  /** 위험물/일반 상태값 */
  isDanger?: number;
}
