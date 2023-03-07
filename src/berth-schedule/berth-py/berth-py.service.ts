import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { alramHistory, berthStatSchedule, databasesHistory } from "src/models";
import { CreateBerthPyDto } from "./dto/create-berth-py.dto";
import { HttpService } from "@nestjs/axios";
import sequelize from "sequelize";
import { Utils } from "src/util/common.utils";
import { GetUserInfoListDto } from "./dto/get-user-info-list.dto";
import { ForAlramPushMessage } from "./interface/berth-alram-push.interface";

@Injectable()
export class BerthPyService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly httpService: HttpService,
    private readonly util: Utils
  ) {}

  /* #region common functions */

  /** 별칭 유무에 따른 메시지 return */
  dependsShipNameMakePushMessage(forAlramPushInterface: ForAlramPushMessage) {
    if (forAlramPushInterface?.isUse !== 1) {
      return `${forAlramPushInterface.trminlCode} 터미널의 ${forAlramPushInterface.oid} 모선항차 입항시간이\n ${forAlramPushInterface.oldCsdhpPrarnde}에서 ${forAlramPushInterface.newCsdhpPrarnde}으로 변경되었습니다.`;
    } else if (forAlramPushInterface?.nickname_01) {
      return `${forAlramPushInterface.trminlCode} 터미널의 ${forAlramPushInterface?.nickname_01}(${forAlramPushInterface.oid}) 모선항차 입항시간이\n ${forAlramPushInterface.oldCsdhpPrarnde}에서 ${forAlramPushInterface.newCsdhpPrarnde}으로 변경되었습니다.`;
    } else {
      throw new InternalServerErrorException("::: no variable :::");
    }
  }

  /** 입항 시간 compare를 위한 SELECT */
  async findOneForDupleData(oid: string) {
    try {
      return await berthStatSchedule.findOne({
        where: { oid: oid },
      });
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
          -- 유저 키값
          users.oid AS userOid,
          -- 유저 연락처
          users.contact,
          -- 유저 연락처2
          users.contact_01,
          users.contact_02,
          users.contact_03,
          users.contact_04,
          users.contact_05,
          users.contact_06,
          users.contact_07,
          users.contact_08,
          users.contact_09,
          -- 알람 on/off
          users.is_nofitication AS isNofitication,
          -- 스케줄 키값
          (SELECT oid FROM berthStat_schedule WHERE oid = alram.schedule_oid) AS berthOid,
          -- 알람 키값
          alram.oid AS alramOid,
          -- 별칭1
          name.nickname_01,
          -- 별칭
          name.is_use AS isUse
        FROM subscription_alram AS alram
        -- 알람을 구독한 유저
        INNER JOIN user AS users ON alram.user_oid = users.oid
        -- 유저가 지정한 모선 별칭
        LEFT JOIN ship_byname AS name ON alram.oid = name.alram_oid
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
    newBerthData: CreateBerthPyDto,
    oldBerthDupleData: berthStatSchedule
  ) {
    try {
      for (const userInfo of userInfoList) {
        /** 별칭 유무에 따른 문자 content */
        const messageContent = this.dependsShipNameMakePushMessage({
          trminlCode: newBerthData.trminlCode,
          oid: newBerthData.oid,
          newCsdhpPrarnde: oldBerthDupleData.csdhpPrarnde,
          oldCsdhpPrarnde: newBerthData.csdhpPrarnde,
          nickname_01: userInfo.nickname_01,
          isUse: userInfo.isUse,
        });

        /** 문자 옵션이 on일때만 푸쉬하기 */
        if (userInfo.isNofitication === 1) {
          Logger.warn("::: message sending :::");
          Logger.warn("userOid ----", userInfo.userOid);
          Logger.warn("contact ----", userInfo.contact);
          Logger.warn("contact_01 ----", userInfo.contact_01);
          Logger.warn("::: message sending :::");
          await this.httpService.axiosRef
            .post(
              `${process.env.MESSAGE_URL}`,
              {
                content: messageContent,
                receivers: [
                  `${userInfo.contact}`,
                  `${userInfo.contact_01}`,
                  `${userInfo.contact_02}`,
                  `${userInfo.contact_03}`,
                  `${userInfo.contact_04}`,
                  `${userInfo.contact_05}`,
                  `${userInfo.contact_06}`,
                  `${userInfo.contact_07}`,
                  `${userInfo.contact_08}`,
                  `${userInfo.contact_09}`,
                ],
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
    newBerthData: CreateBerthPyDto,
    oldBerthDupleData: berthStatSchedule,
    t: any
  ) {
    try {
      for (const userInfo of userInfoList) {
        const ALRAM_HISTORY_OID = await this.util.getOid(
          alramHistory,
          "alramHistory"
        );

        /** 별칭 유무에 따른 문자 content */
        const messageContent = this.dependsShipNameMakePushMessage({
          trminlCode: newBerthData.trminlCode,
          oid: newBerthData.oid,
          newCsdhpPrarnde: oldBerthDupleData.csdhpPrarnde,
          oldCsdhpPrarnde: newBerthData.csdhpPrarnde,
          nickname_01: userInfo.nickname_01,
          isUse: userInfo.isUse,
        });

        /** alram history create obj */
        const makeAlramHistoryObj = {
          oid: ALRAM_HISTORY_OID,
          userOid: userInfo.userOid,
          alramOid: userInfo.alramOid,
          content: messageContent,
        };

        await alramHistory.create(
          { ...makeAlramHistoryObj },
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
                  workOid: ALRAM_HISTORY_OID,
                  tableName: alramHistory.tableName,
                  queryText: sql,
                  userOid: userInfo.userOid,
                });
              } catch (error) {
                Logger.error("logging", error);
              }
            },
          }
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
    const today = new Date();

    try {
      for (const newBerthDupleData of data) {
        /** 모선항차의 중복을 찾기 위한 data */
        const oldBerthDupleData = await this.findOneForDupleData(
          newBerthDupleData.oid
        );

        /** 알람을 구독한 유저 리스트 */
        const userInfoList = await this.findUserInfoListForAlram(
          newBerthDupleData
        );

        if (oldBerthDupleData) {
          /** 중복 있을 시 update */
          await berthStatSchedule.update(newBerthDupleData, {
            where: { oid: newBerthDupleData.oid },
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
                  workOid: newBerthDupleData.oid,
                  tableName: berthStatSchedule.tableName,
                  queryText: sql,
                });
              } catch (error) {
                Logger.error("logging", error);
              }
            },
          });

          /** 터미널 코드가 같으며 입항일이 다를 시 */
          if (
            oldBerthDupleData.trminlCode === newBerthDupleData.trminlCode &&
            oldBerthDupleData.csdhpPrarnde !== newBerthDupleData.csdhpPrarnde
          ) {
            Logger.warn(
              `csdhpPrarnde=::: ${today.toISOString()}\n ${
                newBerthDupleData.oid
              } - ${newBerthDupleData.csdhpPrarnde} ::: is change! :::`
            );

            /** 이전 접안일 데이터 update */
            await berthStatSchedule.update(
              { previousCsdhpPrarnde: oldBerthDupleData.csdhpPrarnde },
              { where: { oid: newBerthDupleData.oid }, transaction: t }
            );

            /** 입항일자 변경으로 인한 문자 전송 */
            await this.sendAlramOfcsdhpPrarnde(
              userInfoList,
              newBerthDupleData,
              oldBerthDupleData
            );

            /** 알람 메시지 create */
            await this.sendWebAlramOfcsdhpPrarnde(
              userInfoList,
              newBerthDupleData,
              oldBerthDupleData,
              t
            );
          }
        } else {
          Logger.debug(
            `::: is upsert ::: ${today.toISOString()}\n ${
              newBerthDupleData.oid
            }`
          );
          await berthStatSchedule.upsert(newBerthDupleData, { transaction: t });
        }
      }

      await t.commit();
      Logger.debug("::: commit complete :::");
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
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
