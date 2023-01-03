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
    /** 페이징 카운트의 디폴트값 */
    const PAGE_ITEM_COUNT = 20;
    /** OFFSET 계산 */
    const OFFSET = PAGE_ITEM_COUNT * data.pageIndex;
    /** 매번 새로운 객체의 선석 데이터 */
    const BERTH_PAGING_ITEMS = new Array<BerthStatDto>();

    if ("number" !== typeof data.pageIndex) {
      throw new NotFoundException("Is not number or this value is undefined");
    }

    if (typeof null === typeof data.pageIndex) {
      throw new NotFoundException("Is null");
    }

    try {
      /** 페이징을 위한 SELECT */
      const berthStatListForPage =
        await this.dashBoardRepository.findForPageInfo(OFFSET, query);

      /** 페이징 계산을 위한 SELECT */
      const berthStatListForPageAll =
        await this.dashBoardRepository.findForPageInfoAll(query);

      if (berthStatListForPage.length !== 0) {
        data.pageItemCount = PAGE_ITEM_COUNT;
        data.totalDocumentCount = berthStatListForPageAll.length;
        data.totalPageCount = Math.ceil(berthStatListForPageAll.length / 20);
        data.currentItemCount = berthStatListForPage.length;

        /** 페이징 계산 데이터 */
        const PAGE_INFO = { ...data };

        berthStatListForPage.map((value: BerthStatDto) => {
          BERTH_PAGING_ITEMS.push(value);
        });

        this.pageInfoDto.items = BERTH_PAGING_ITEMS;
        this.pageInfoDto.pageInfo = PAGE_INFO;

        return this.pageInfoDto;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
