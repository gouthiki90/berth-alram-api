import { Injectable } from "@nestjs/common";

@Injectable()
export class ContainerUpdateRemarkDto {
  /** container oid */
  oid?: string;
  /** container remark */
  remark?: string;
}
