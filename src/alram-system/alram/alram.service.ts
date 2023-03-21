import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseFilters,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { ErrorHandler } from "src/error-handler/error-handler";
import {
  container,
  databasesHistory,
  shipByname,
  subscriptionAlram,
} from "src/models";
import { Utils } from "src/util/common.utils";
import { AlramRepository } from "./alram.repository";
import { OffsetAlramDto } from "./dto/alram-offset-dto";
import { CreateAlramDto } from "./dto/create-alram.dto";
import { OffsetPagenatedAlramStateDataDto } from "./dto/off-set-pagenated-alram-state-data.dto";
import { OffsetPagingInfoDto } from "./dto/offset-page-info.dto";
import { RemoveAlramDto } from "./dto/remove-alram.dto";
import { UpdateAlramDto } from "./dto/update-alram.dto";
import { AlramMeesage } from "./interface/alram.enums";

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

  /** 알람 구독 생성 */
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
            message: `${alramOfBerthOidDupleData?.scheduleOid} ${AlramMeesage.REQUEIRD}`,
          };
        } else {
          const ALRAM_OID = await this.util.getOid(
            subscriptionAlram,
            "subscriptionAlram"
          );
          obj.oid = ALRAM_OID;
          await subscriptionAlram.create(
            { ...obj },
            {
              transaction: t,
              async logging(sql) {
                const util = new Utils();
                try {
                  /** oid 생성 */
                  const oid = await util.getOid(
                    databasesHistory,
                    "databasesHistory"
                  );

                  await databasesHistory.create({
                    oid: oid,
                    workOid: ALRAM_OID,
                    tableName: subscriptionAlram.tableName,
                    queryText: sql,
                    userOid: obj.userOid,
                  });
                } catch (error) {
                  Logger.error("logging", error);
                }
              },
            }
          );
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

  /** 알람 업데이트 */
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

  /** 알람 삭제 */
  async remove(data: Array<RemoveAlramDto>) {
    Logger.debug(data);
    const t = await this.seqeulize.transaction();
    try {
      /** alram remove */
      for (const obj of data) {
        Logger.debug(obj.alramOid);
        await subscriptionAlram.destroy({
          where: { oid: obj.alramOid },
          transaction: t,
          /** query logging */
          async logging(sql) {
            const util = new Utils();
            try {
              /** oid 생성 */
              const oid = await util.getOid(
                databasesHistory,
                "databasesHistory"
              );

              await databasesHistory.create({
                oid: oid,
                workOid: obj.alramOid,
                tableName: subscriptionAlram.tableName,
                queryText: sql,
                userOid: obj.userOid,
              });
            } catch (error) {
              Logger.error("logging", error);
            }
          },
        });
      }

      /** child container remove */
      for (const obj of data) {
        Logger.debug(obj.alramOid);
        /** 지워야 할 알람 oid find data list */
        const havingAlramOidContainers = await container.findAll({
          where: { alramOid: obj.alramOid },
        });

        for (const con of havingAlramOidContainers) {
          Logger.debug(con.oid);
          await container.destroy({ where: { oid: con.oid }, transaction: t });
        }
      }

      /** child shipByName remove */
      for (const obj of data) {
        /** 별칭을 가지고 있는 구독 리스트 */
        const havingAlramOidShipByName = await shipByname.findAll({
          where: { alramOid: obj.alramOid },
        });

        havingAlramOidShipByName.map(async (curr) => {
          Logger.debug(curr.oid);
          await shipByname.destroy({ where: { oid: curr.oid } });
        });
      }

      const result = await t.commit();
      return result;
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException("failed to delete alram data");
    }
  }

  /** 알람 대쉬보드 */
  async makePageInfoForAlramList(data: OffsetPagingInfoDto, oid: string) {
    /** 20개로 최대 고정값 */
    const PAGE_ITEM_COUNT = 20;
    /** OFFSET 계산값 */
    const offset = PAGE_ITEM_COUNT * data.pageIndex;
    /** 선석 데이터 리스트 */
    const berthItems = new Array<OffsetAlramDto>();
    /** IN에 넣을 터미널 코드 */
    const trminalCodes = data.trminlCodeList.join("','");
    /** 별칭(화주) 검색 keyword */
    const nicknameSearchKeyword = data.nickname_01;

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
        trminalCodes,
        data.isLastViewDto.isLastView,
        nicknameSearchKeyword
      );

      /** 페이징 값을 구하기 위한 SELECT */
      const userAlramListForPagingAll = await this.alramRepository.findAll(
        oid,
        trminalCodes,
        data.isLastViewDto.isLastView,
        nicknameSearchKeyword
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
