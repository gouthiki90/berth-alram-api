import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteContainerDto {
  /** 컨테이너 키값 */
  oid: Array<string>;
}
