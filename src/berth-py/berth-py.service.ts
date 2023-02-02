import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { alramHistory, berthStatSchedule } from "src/models";
import { CreateBerthPyDto } from "./dto/create-berth-py.dto";
import { HttpService } from "@nestjs/axios";
import sequelize from "sequelize";
import { Utils } from "src/util/common.utils";
import { GetUserInfoListDto } from "./dto/get-user-info-list.dto";

@Injectable()
export class BerthPyService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly httpService: HttpService,
    private readonly util: Utils
  ) {}

  /* #region common functions */

  /** 입항 시간 compare를 위한 SELECT */
  async findOneForDupleData(oid: string) {
    try {
      return await berthStatSchedule.findOne({ where: { oid: oid } });
    } catch (error) {
      Logger.error(error);
    }
  }

  /** 해당 모선항차를 구독한 유저들 */
  async findUserInfoListForAlram(obj: CreateBerthPyDto) {
    try {
      const userInfoList = await this.seqeulize.query(
        `
        SELECT
          users.oid AS userOid,
          users.contact,
          users.contact_01,
          users.is_nofitication AS isNofitication,
          (SELECT oid FROM berthStat_schedule WHERE oid = alram.schedule_oid) AS berthOid,
          alram.oid AS alramOid
        FROM subscription_alram AS alram
        INNER JOIN user AS users ON alram.user_oid = users.oid
        WHERE TRUE
        AND alram.schedule_oid = '${obj.oid}'
        `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return userInfoList;
    } catch (error) {
      Logger.error(error);
    }
  }

  /** 이전 데이터 삭제를 위한 SELECT */
  async findAllBerthOldDataList() {
    return await this.seqeulize.query(
      `
      SELECT 
        oid
      FROM
          berthStat_schedule
      WHERE
        TRUE
        -- 출항일이 3일 지난 것만
        AND DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
                MID(tkoffPrarnde, 2, 16),
                LEFT(tkoffPrarnde, 19)),
            '%Y-%m-%d %H:%i') IN (IF(DATE_ADD(DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
                    MID(tkoffPrarnde, 2, 16),
                    LEFT(tkoffPrarnde, 19)),
                '%Y-%m-%d %H:%i'), INTERVAL 3 DAY) < DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i'),
        DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
                    MID(tkoffPrarnde, 2, 16),
                    LEFT(tkoffPrarnde, 19)),
                '%Y-%m-%d %H:%i'),
        NULL))
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        model: berthStatSchedule,
        mapToModel: true,
      }
    );
  }

  /** 입항 시간에 따른 알람 푸쉬 */
  async sendAlramOfcsdhpPrarnde(
    userInfoList: Array<GetUserInfoListDto>,
    obj: CreateBerthPyDto,
    berthDupleData: berthStatSchedule
  ) {
    try {
      for (const userInfo of userInfoList) {
        /** 문자 옵션이 on일때만 푸쉬하기 */
        if (userInfo.isNofitication === 1) {
          await this.httpService.axiosRef
            .post(
              "https://46fzjva0mk.execute-api.ap-northeast-2.amazonaws.com/dev",
              {
                content: `${obj.trminlCode} 터미널의 ${obj.oid} 모선항차 입항시간이 ${berthDupleData.csdhpPrarnde}에서 ${obj.csdhpPrarnde}으로 변경되었습니다.`,
                receivers: [`${userInfo.contact}`, `${userInfo.contact_01}`],
              },
              {
                headers: {
                  "x-api-key": `${process.env.MESSAGE_KEY}`,
                },
              }
            )
            .catch((error) => {
              Logger.error(error);
            });
        } else {
          continue;
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  /** 웹 알람 기록을 위한 create */
  async sendWebAlramOfcsdhpPrarnde(
    userInfoList: Array<GetUserInfoListDto>,
    berthObj: CreateBerthPyDto,
    berthDupleData: berthStatSchedule,
    t: any
  ) {
    try {
      for (const userInfo of userInfoList) {
        const ALRAM_HISTORY_OID = await this.util.getOid(
          alramHistory,
          "alramHistory"
        );

        /** alram history create obj */
        const makeAlramHistoryObj = {
          oid: ALRAM_HISTORY_OID,
          userOid: userInfo.userOid,
          alramOid: userInfo.alramOid,
          content: `${berthObj.trminlCode} 터미널의 ${berthObj.oid} 모선항차 입항시간이 ${berthDupleData.csdhpPrarnde}에서 ${berthObj.csdhpPrarnde}으로 변경되었습니다.`,
        };

        await alramHistory.create(
          { ...makeAlramHistoryObj },
          { transaction: t }
        );
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException("메시지 전송 실패");
    }
  }

  /* #endregion */

  /** berth data create and alram push */
  async create(data: Array<CreateBerthPyDto>) {
    const t = await this.seqeulize.transaction();

    try {
      for (const obj of data) {
        const today = new Date();
        /** 모선항차의 중복을 찾기 위한 data */
        /** 이전에 가져온 데이터 명시 필요 */
        const berthDupleData = await this.findOneForDupleData(obj.oid);

        /** 알람을 구독한 유저 리스트 */
        const userInfoList = await this.findUserInfoListForAlram(obj);

        if (berthDupleData) {
          /** 중복 있을 시 update */
          await berthStatSchedule.update(obj, {
            where: { oid: obj.oid },
            transaction: t,
          });

          if (
            berthDupleData.trminlCode === obj.trminlCode &&
            berthDupleData.csdhpPrarnde !== obj.csdhpPrarnde
          ) {
            Logger.warn(
              `csdhpPrarnde=::: ${today.toISOString()}\n ${obj.oid} - ${
                obj.csdhpPrarnde
              } ::: is change! :::`
            );

            /** 이전 접안일 데이터 update */
            await berthStatSchedule.update(
              { previousCsdhpPrarnde: berthDupleData.csdhpPrarnde },
              { where: { oid: obj.oid }, transaction: t }
            );

            try {
              /** 입항일자 변경으로 인한 문자 전송 */
              await this.sendAlramOfcsdhpPrarnde(
                userInfoList,
                obj,
                berthDupleData
              );
            } catch (error) {
              Logger.error(error);
            }

            try {
              /** 알람 메시지 create */
              await this.sendWebAlramOfcsdhpPrarnde(
                userInfoList,
                obj,
                berthDupleData,
                t
              );
            } catch (error) {
              Logger.error(error);
            }
          }
        } else {
          Logger.debug("::: is upsert :::");
          await berthStatSchedule.upsert(obj, { transaction: t });
        }
      }

      await t.commit();
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException("error in server");
    }
  }

  /** delete berth old data */
  async deleteOldBerthData() {
    const t = await this.seqeulize.transaction();
    Logger.warn(`TODAY ::: ${new Date()} :::`);
    try {
      /** 삭제할 선석 데이터 */
      const getAllBerthOldDataList = await this.findAllBerthOldDataList();

      if (getAllBerthOldDataList.length === 0) {
        await t.rollback();
        return;
      }

      for (const obj of getAllBerthOldDataList) {
        await berthStatSchedule.destroy({
          where: { oid: obj.oid },
          transaction: t,
        });
      }

      await t.commit();
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException("failed to delete data");
    }
  }

  /** delete berth old data */
  // @Cron(CronExpression.EVERY_2ND_MONTH, {
  //   name: "deleteOldBerthDataSchedule",
  // })
  // async deleteOldBerthDataSchedule() {
  //   try {
  //     Logger.warn(`::: deleteOldBerthDataSchedule Start... :::`);
  //     await this.deleteOldBerthData();
  //     Logger.warn(`::: deleteOldBerthDataSchedule end... :::`);
  //   } catch (error) {
  //     Logger.error(`::: deleteOldBerthDataSchedule Error! :::`);
  //     Logger.error(error);
  //     const GET_JOB = this.schedulerRegistry.getCronJob(
  //       "deleteOldBerthDataSchedule"
  //     );
  //     GET_JOB.stop();
  //   }
  // }
}
