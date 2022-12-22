import { Injectable, Logger } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { berthStatSchedule, user } from "src/models";
import { CreateBerthPyDto } from "./dto/create-berth-py.dto";
import { HttpService } from "@nestjs/axios";
import sequelize from "sequelize";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class BerthPyService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly httpService: HttpService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  /** 입항 시간 compare를 위한 SELECT */
  async findOneForDupleData(oid: string) {
    try {
      return await berthStatSchedule.findOne({ where: { oid: oid } });
    } catch (error) {
      console.log(error);
    }
  }

  /** 해당 모선항차를 구독한 유저들 */
  async findUserInfoListForAlram(obj: CreateBerthPyDto) {
    try {
      const userInfoList = await this.seqeulize.query(
        `
        SELECT
          users.contact,
          berth.oid
        FROM subscription_alram AS alram
        LEFT JOIN user AS users ON alram.user_oid = users.oid
        LEFT JOIN berthStat_schedule AS berth ON alram.schedule_oid
        WHERE TRUE
        AND alram.schedule_oid = '${obj.oid}'
        `,
        {
          type: sequelize.QueryTypes.SELECT,
          mapToModel: true,
          model: user,
        }
      );
      return userInfoList;
    } catch (error) {
      console.log(error);
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
        IF(
          LEFT(tkoffPrarnde, 1
          )
        = '(',
        MID(
          tkoffPrarnde, 2, 16
        ),
        LEFT(
          tkoffPrarnde, 19)
        )
        BETWEEN (
          SELECT 
            DATE_FORMAT(DATE_ADD(NOW(), INTERVAL - 5 DAY), '%Y-%m-%d')
          FROM DUAL)
        AND
        (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d') FROM DUAL)
      `,
      { type: sequelize.QueryTypes.SELECT }
    );
  }

  /** 입항 시간에 따른 알람 푸쉬 */
  async sendAlramOfcsdhpPrarnde(
    userInfoList: Array<user>,
    obj: CreateBerthPyDto,
    berthDupleData: berthStatSchedule
  ) {
    try {
      for (const userInfo of userInfoList) {
        this.httpService.axiosRef.post(
          "https://46fzjva0mk.execute-api.ap-northeast-2.amazonaws.com/dev",
          {
            content: `${obj.trminlCode} 터미널의 ${obj.oid} 모선항차 입항시간이 ${berthDupleData.csdhpPrarnde}에서 ${obj.csdhpPrarnde}으로 변경되었습니다.`,
            receivers: [`${userInfo.contact}`],
          },
          {
            headers: {
              "x-api-key": `${process.env.MESSAGE_KEY}`,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async create(data: Array<CreateBerthPyDto>) {
    const t = await this.seqeulize.transaction();
    /** 신항 터미널 리스트 */
    const NEW_PORT_LIST = [
      "PNIT",
      "PNC",
      "HJNC",
      "HPNT",
      "BNCT",
      "UNCT",
      "PICT",
    ];
    try {
      for (const obj of data) {
        // duple check
        const berthDupleData = await this.findOneForDupleData(obj.oid);

        /** 알람을 구독한 유저 리스트 */
        const userInfoList = await this.findUserInfoListForAlram(obj);

        if (berthDupleData) {
          /** 신항은 1로 대입 */
          NEW_PORT_LIST.forEach((element: string) => {
            if (element === obj.trminlCode) {
              obj.isNewPort = 1;
            }
          });

          await berthStatSchedule.update(obj, {
            where: { oid: obj.oid },
            transaction: t,
          });

          if (berthDupleData.csdhpPrarnde !== obj.csdhpPrarnde) {
            console.log(`csdhpPrarnde=${obj.csdhpPrarnde} ::: is change! :::`);

            /** 이전 접안일 데이터 update */
            await berthStatSchedule.update(
              { previousCsdhpPrarnde: berthDupleData.csdhpPrarnde },
              { where: { oid: obj.oid }, transaction: t }
            );

            /** 문자 전송 */
            await this.sendAlramOfcsdhpPrarnde(
              userInfoList,
              obj,
              berthDupleData
            );
          }
        } else {
          await berthStatSchedule.upsert(obj, { transaction: t });
        }
      }

      await t.commit();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteOldBerthData() {
    const t = await this.seqeulize.transaction();
    Logger.warn(`TODAY ::: ${new Date()} :::`);
    try {
      /** 삭제할 선석 데이터 */
      const getAllBerthOldDataList = await this.findAllBerthOldDataList();

      for (const obj of getAllBerthOldDataList) {
        await berthStatSchedule.destroy({ where: { oid: obj } });
      }

      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  @Cron(CronExpression.EVERY_WEEKEND, {
    name: "deleteOldBerthDataSchedule",
  })
  async deleteOldBerthDataSchedule() {
    try {
      Logger.warn(`::: deleteOldBerthDataSchedule Start... :::`);
      await this.deleteOldBerthData();
      Logger.warn(`::: deleteOldBerthDataSchedule end... :::`);
    } catch (error) {
      Logger.error(`::: deleteOldBerthDataSchedule Error! :::`);
      console.log(error);
      const GET_JOB = this.schedulerRegistry.getCronJob(
        "deleteOldBerthDataSchedule"
      );
      GET_JOB.stop();
    }
  }
}
