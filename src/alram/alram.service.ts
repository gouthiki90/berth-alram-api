import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseFilters,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { ErrorHandler } from "src/error-handler/error-handler";
import { container, subscriptionAlram } from "src/models";
import { Utils } from "src/util/common.utils";
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
    private readonly alramRepository: AlramRepository,
    private readonly util: Utils
  ) {}

  /** 중복된 알람을 찾기 위한 SELECT */
  async getAlramOfBerthOidDupleData(obj: CreateAlramDto) {
    try {
      return await subscriptionAlram.findOne({
        where: { scheduleOid: obj.scheduleOid, userOid: obj.userOid },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async create(data: Array<CreateAlramDto>) {
    const t = await this.seqeulize.transaction();
    try {
      for (const obj of data) {
        /** 중복된 알람을 찾기 위한 data */
        const alramOfBerthOidDupleData = await this.getAlramOfBerthOidDupleData(
          obj
        );

        if (alramOfBerthOidDupleData) {
          await t.rollback();
          return {
            message: `${alramOfBerthOidDupleData?.scheduleOid} 해당 모선항차는 이미 구독한 알람입니다.`,
          };
        } else {
          const ALRAM_OID = await this.util.getOid(
            subscriptionAlram,
            "subscriptionAlram"
          );
          obj.oid = ALRAM_OID;
          await subscriptionAlram.create({ ...obj }, { transaction: t });
        }
      }

      const result = await t.commit();
      return result;
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException("faield to create alram data");
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
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException("faield alram update data");
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

      /** child container remove */
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
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException("failed to delete alram data");
    }
  }

  async makePageInfoForAlramList(data: OffsetPagingInfoDto, oid: string) {
    /** 20개로 최대 고정값 */
    const PAGE_ITEM_COUNT = 20;
    /** OFFSET 계산값 */
    const offset = PAGE_ITEM_COUNT * data.pageIndex;
    /** 선석 데이터 리스트 */
    const berthItems = new Array<OffsetAlramDto>();
    /** IN에 넣을 터미널 코드 */
    const trminalCodes = data.trminlCodeList.join("','");

    try {
      if ("number" !== typeof data.pageIndex) {
        throw new NotFoundException("Is not number or this value is undefined");
      }

      if (typeof null === typeof data.pageIndex) {
        throw new NotFoundException("Is null");
      }

      /** 페이징 적용 SELECT */
      const userAlramListForPaging = await this.alramRepository.findOne(
        oid,
        offset,
        trminalCodes
      );

      /** 페이징 값을 구하기 위한 SELECT */
      const userAlramListForPagingAll = await this.alramRepository.findAll(
        oid,
        trminalCodes
      );

      if (userAlramListForPaging.length !== 0) {
        data.pageItemCount = PAGE_ITEM_COUNT;
        data.totalDocumentCount = userAlramListForPagingAll.length;
        data.totalPageCount = Math.ceil(userAlramListForPagingAll.length / 20);
        data.currentItemCount = userAlramListForPaging.length;

        /** 페이징 data */
        const pageInfo = { ...data };

        /** 페이징에 따른 데이터 push */
        userAlramListForPaging.map((value: OffsetAlramDto) => {
          berthItems.push(value);
        });

        this.pageInfoDto.items = berthItems;
        this.pageInfoDto.pageInfo = pageInfo;

        return this.pageInfoDto;
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException("백엔드 로직 중 에러");
    }
  }
}
