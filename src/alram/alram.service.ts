import { Injectable, NotFoundException, UseFilters } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Sequelize } from "sequelize-typescript";
import { ErrorHandler } from "src/error-handler/error-handler";
import { container, subscriptionAlram } from "src/models";
import { AlramRepository } from "./alram.repository";
import { OffsetAlramDto } from "./dto/alram-offset-dto";
import { CreateAlramDto } from "./dto/create-alram.dto";
import { OffsetPagenatedAlramStateDataDto } from "./dto/off-set-pagenated-alram-state-data.dto";
import { OffsetPagingInfoDto } from "./dto/offset-page-info.dto";
import { RemoveAlramDto } from "./dto/remove-alram.dto";
import { UpdateAlramDto } from "./dto/update-alram.dto";

@UseFilters(ErrorHandler)
@Injectable()
export class AlramService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly pageInfoDto: OffsetPagenatedAlramStateDataDto,
    private readonly alramRepository: AlramRepository
  ) {}
  async create(data: Array<CreateAlramDto>) {
    const t = await this.seqeulize.transaction();
    try {
      for (const obj of data) {
        obj.oid = randomUUID().toString();
        await subscriptionAlram.create({ ...obj }, { transaction: t });
      }
      const result = await t.commit();
      return result;
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  async update(updateAlramDto: UpdateAlramDto) {
    const t = await this.seqeulize.transaction();
    try {
      await subscriptionAlram.update(updateAlramDto, {
        where: { oid: updateAlramDto.oid },
        transaction: t,
      });
      const result = await t.commit();
      return result;
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  async remove(data: Array<RemoveAlramDto>) {
    const t = await this.seqeulize.transaction();
    try {
      /** alram remove */
      for (const obj of data) {
        await subscriptionAlram.destroy({
          where: { oid: obj.alramOid },
          transaction: t,
        });
      }

      /** container remove */
      for (const obj of data) {
        const havingAlramOidContainers = await container.findAll({
          where: { alramOid: obj.alramOid },
        });

        for (const con of havingAlramOidContainers) {
          await container.destroy({ where: { oid: con.oid }, transaction: t });
        }
      }

      const result = await t.commit();
      return result;
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  async makePageInfoForAlramList(data: OffsetPagingInfoDto, oid: string) {
    /** 20개로 최대 고정값 */
    const PAGE_ITEM_COUNT = 20;
    /** OFFSET 계산값 */
    const OFFSET = PAGE_ITEM_COUNT * data.pageIndex;
    /** 선석 데이터 리스트 */
    const BERTH_ITEMS = new Array<OffsetAlramDto>();
    /** IN에 넣을 터미널 코드 */
    const TRMINAL_CODES = data.trminlCodeList.join("','");

    try {
      if ("number" !== typeof data.pageIndex) {
        throw new NotFoundException("Is not number or this value is undefined");
      }

      if (typeof null === typeof data.pageIndex) {
        throw new NotFoundException("Is null");
      }

      const userAlramListForPaging = await this.alramRepository.findOne(
        oid,
        OFFSET,
        TRMINAL_CODES
      );

      const userAlramListForPagingAll = await this.alramRepository.findAll(
        oid,
        TRMINAL_CODES
      );

      if (userAlramListForPaging.length !== 0) {
        data.pageItemCount = PAGE_ITEM_COUNT;
        data.totalDocumentCount = userAlramListForPagingAll.length;
        data.totalPageCount = Math.ceil(userAlramListForPagingAll.length / 20);
        data.currentItemCount = userAlramListForPaging.length;

        const PAGE_INFO = { ...data };

        userAlramListForPaging.map((value: OffsetAlramDto) => {
          BERTH_ITEMS.push(value);
        });

        this.pageInfoDto.items = BERTH_ITEMS;
        this.pageInfoDto.pageInfo = PAGE_INFO;

        return this.pageInfoDto;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
