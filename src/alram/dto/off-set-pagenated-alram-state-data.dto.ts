import { OffsetAlramDto } from "./alram-offset-dto";
import { OffsetPagingInfoDto } from "./offset-page-info.dto";

export class OffsetPagenatedAlramStateDataDto {
  /** 선석 데이터 리스트 */
  items?: Array<OffsetAlramDto>;
  /** 페이징 데이터 */
  pageInfo?: OffsetPagingInfoDto;
  /** 터미널 코드 */
  trminalCode?: Array<string>;
}
