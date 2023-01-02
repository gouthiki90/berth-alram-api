import { Injectable } from "@nestjs/common";

@Injectable()
export class TrminalCodeListDto {
  /** 터미널 코드 */
  trminalCode?: Array<string>;
}
