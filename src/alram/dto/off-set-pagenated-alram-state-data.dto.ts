import { OffsetPagingInfoDto } from "src/dashboard/dto/offset-page-info.dto";
import { OffsetAlramDto } from "./alram-offset-dto";

export class OffsetPagenatedAlramStateDataDto {
  items?: Array<OffsetAlramDto>;
  pageInfo?: OffsetPagingInfoDto;
}
