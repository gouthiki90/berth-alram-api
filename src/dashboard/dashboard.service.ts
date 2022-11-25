import { Injectable, NotFoundException, UseFilters } from "@nestjs/common";
import { ErrorHandler } from "src/error-handler/error-handler";
import { DashBoardRepository } from "./dashboard.repository";
import { BerthQueryDto } from "./dto/berth-query.dto";
import { BerthStatDto } from "./dto/berth-state.dto";
import { OffsetPagingInfoDto } from "./dto/offset-page-info.dto";
import { OffsetPagenatedBerthStateDataDto } from "./dto/offset-pagenated-berth-state-data.dto";

@UseFilters(ErrorHandler)
@Injectable()
export class DashboardService {
  constructor(
    private readonly dashBoardRepository: DashBoardRepository,
    private readonly pageInfoDto: OffsetPagenatedBerthStateDataDto
  ) {}
  async makePageInfo(data: OffsetPagingInfoDto, query: BerthQueryDto) {
    const PAGE_ITEM_COUNT = 20;
    const itmes = new Array<BerthStatDto>();

    if ("number" !== typeof data.pageIndex) {
      throw new NotFoundException("Is not number or this value is undefined");
    }

    if (typeof null === typeof data.pageIndex) {
      throw new NotFoundException("Is null");
    }

    try {
      const berthStatListForPage =
        await this.dashBoardRepository.findForPageInfo(data.pageIndex, query);
      const berthStatListForPageAll =
        await this.dashBoardRepository.findForPageInfoAll(query);

      if (berthStatListForPage.length !== 0) {
        data.pageItemCount = PAGE_ITEM_COUNT;
        data.totalDocumentCount = berthStatListForPageAll.length;
        data.totalPageCount = Math.ceil(berthStatListForPageAll.length / 20);
        data.currentItemCount = berthStatListForPage.length;

        const PAGE_INFO = { ...data };

        berthStatListForPage.map((value: BerthStatDto) => {
          itmes.push(value);
        });

        this.pageInfoDto.items = itmes;
        this.pageInfoDto.pageInfo = PAGE_INFO;

        return this.pageInfoDto;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
