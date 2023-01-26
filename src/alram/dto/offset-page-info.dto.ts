import { Injectable } from "@nestjs/common";

@Injectable()
export class OffsetPagingInfoDto {
  /** 현재 페이지에서 출력한 데이터 수 */
  currentItemCount: number;
  /** 선택한 페이지 번호 */
  pageIndex: number;
  /** 페이지당 기준 데이터 수 */
  pageItemCount: number;
  /** 전체 아이템 수 */
  totalDocumentCount: number;
  /** 전체 페이지 수 */
  totalPageCount: number;
  /** 터미널코드 리스트 */
  trminlCodeList?: Array<string>;
  /** 이전 출항일도 보기 옵션 dto */
  isLastViewDto?: {
    /** 이전 출항일도 보기 옵션 */
    isLastView?: boolean;
  };
}
