import { BerthStatDto } from "./berth-state.dto";
import { OffsetPagingInfoDto } from "./offset-page-info.dto";

export class OffsetPagenatedBerthStateDataDto {
  /** 선석 스케줄 데이터 */
  items: Array<BerthStatDto>;
  /** 페이징 info */
  pageInfo: OffsetPagingInfoDto;
}
