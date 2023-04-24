import { ForPagingCompanyDto } from "./for-paging-company.dto";
import { OffsetPagingInfoDto } from "./offset-paging-info.dto";

export class OffsetPagenatedBerthStateDataDto {
  /** 선석 스케줄 데이터 */
  items: Array<ForPagingCompanyDto>;
  /** 페이징 info */
  pageInfo: OffsetPagingInfoDto;
}
