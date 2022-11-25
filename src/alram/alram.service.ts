import { Injectable, NotFoundException, UseFilters } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Sequelize } from "sequelize-typescript";
import { OffsetPagingInfoDto } from "src/dashboard/dto/offset-page-info.dto";
import { ErrorHandler } from "src/error-handler/error-handler";
import { subscriptionAlram } from "src/models";
import { AlramRepository } from "./alram.repository";
import { OffsetAlramDto } from "./dto/alram-offset-dto";
import { CreateAlramDto } from "./dto/create-alram.dto";
import { OffsetPagenatedAlramStateDataDto } from "./dto/off-set-pagenated-alram-state-data.dto";
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
      for (const obj of data) {
        await subscriptionAlram.destroy({
          where: { oid: obj.alramOid },
          transaction: t,
        });
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
    const itmes = new Array<OffsetAlramDto>();

    if ("number" !== typeof data.pageIndex) {
      throw new NotFoundException("Is not number or this value is undefined");
    }

    if (typeof null === typeof data.pageIndex) {
      throw new NotFoundException("Is null");
    }

    try {
      const userAlramListForPaging = await this.alramRepository.findOne(
        oid,
        data.pageIndex
      );

      const userAlramListForPagingAll = await this.alramRepository.findAll(oid);

      if (userAlramListForPaging.length !== 0) {
        data.pageItemCount = PAGE_ITEM_COUNT;
        data.totalDocumentCount = userAlramListForPagingAll.length;
        data.totalPageCount = Math.ceil(userAlramListForPagingAll.length / 20);
        data.currentItemCount = userAlramListForPaging.length;

        const PAGE_INFO = { ...data };

        userAlramListForPaging.map((value: OffsetAlramDto) => {
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