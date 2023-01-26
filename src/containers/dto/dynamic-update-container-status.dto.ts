import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicUpdateContainerStatus {
  /** container oid */
  oid?: string;
  /** container status */
  containerStatus?: number;
}
