import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchShippingTimeDto {
  /** 컨테이너 넘버 */
  containerNumber?: string;
}
