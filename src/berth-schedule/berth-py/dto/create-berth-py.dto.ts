import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateBerthPyDto {
  /** 선석 스케줄 키값 */
  oid: string;
  /** 터미널 코드 */
  trminlCode?: string;
  /** 모선 코드 */
  berthCode?: string;
  /** 모선-선사항차 */
  trminlVoyg?: string;
  /** 선사 */
  wtorcmpCode?: string;
  /** 모선명 */
  trminlShipnm?: string;
  /** 항로 */
  shipRute?: string;
  /** 입항일시 */
  csdhpPrarnde?: string;
  /** 출항일시 */
  tkoffPrarnde?: string;
  /** 접안/접안방향 */
  csdhpDrc?: string;
  /** 작업시작일시 */
  workStarDay?: string;
  /** 완료일시 */
  workFiniDay?: string;
  /** 반입마감일지 */
  carryFiniDay?: string;
  /** 양하수량 */
  landngQy?: string;
  /** 적하수량 */
  shipngQy?: string;
  /** 이적수량 */
  reshmtQy?: string;
  /** 전배 */
  predBerth?: string;
  /** 선적 */
  shipment?: string;
  /** S/H */
  shifting?: string;
}
