import { BerthStatDto } from "./berth-state.dto";
import { OffsetPagingInfoDto } from "./offset-page-info.dto";

export class OffsetPagenatedBerthStateDataDto {
  items: Array<BerthStatDto>;
  pageInfo: OffsetPagingInfoDto;
}
