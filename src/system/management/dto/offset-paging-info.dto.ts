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
}
