import { Injectable, Logger } from "@nestjs/common";
import sequelize from "sequelize";
import { BerthPyDto } from "../alram-push/dto/berth.dto";
import { HttpService } from "@nestjs/axios";
import { Sequelize } from "sequelize-typescript";
import { berthStatSchedule, subscriptionAlram, user } from "src/models";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class AlramPushService {
  constructor(
    private readonly httpService: HttpService,
    private readonly seqeulize: Sequelize,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  /** 날짜 체크를 위한 선석 SELECT */
  async findAllBerthData() {
    let getList: any;
    const pushList: berthStatSchedule[] = [];
    try {
      const inAlramBerthDataList = await this.seqeulize.query(
        `
        SELECT
          alram.schedule_oid
        FROM subscription_alram AS alram
        WHERE TRUE
          `,
        {
          type: sequelize.QueryTypes.SELECT,
          mapToModel: true,
          model: subscriptionAlram,
        }
      );

      if (inAlramBerthDataList) {
        for (const obj of inAlramBerthDataList) {
          getList = await berthStatSchedule.findAll({
            where: { oid: obj.scheduleOid },
          });
        }
        pushList.push(getList);
        return pushList;
      }
    } catch (error) {
      console.log(error);
    }
  }

  /** 해당 모선항차를 구독한 유저들 */
  async findUserInfoListForAlram(obj: BerthPyDto) {
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

  /** 날짜에 따른 알람 푸쉬 */
  async sendAlramOfDayAgo(userInfoList: Array<user>, obj: BerthPyDto) {
    const TODAY = new Date();
    const ONE_DAYS_AGO = [
      new Date(TODAY.setDate(TODAY.getDate() - 1)).getDate(),
      "1일",
    ];
    const TOW_DAYS_AGO = [
      new Date(TODAY.setDate(TODAY.getDate() - 2)).getDate(),
      "2일",
    ];
    const THREE_DAYS_AGO = [
      new Date(TODAY.setDate(TODAY.getDate() - 3)).getDate(),
      "3일",
    ];
    const BERTH_DAY = new Date(obj.csdhpPrarnde).getDate();

    const sendMessage = (contact: string, comment: any) => {
      this.httpService.axiosRef.post(
        "https://46fzjva0mk.execute-api.ap-northeast-2.amazonaws.com/dev",
        {
          content: `${obj.trminlCode} 터미널의 입항시간이 ${comment} 전입니다.`,
          receivers: [`${contact}`],
        },
        {
          headers: {
            "x-api-key": `${process.env.MESSAGE_KEY}`,
          },
        }
      );
    };

    console.log("::: compare Date :::", {
      ONE_DAYS_AGO,
      TOW_DAYS_AGO,
      THREE_DAYS_AGO,
      BERTH_DAY,
    });

    try {
      if (ONE_DAYS_AGO[0] === BERTH_DAY) {
        Logger.warn("1일 남음");
        for (const userInfo of userInfoList) {
          sendMessage(userInfo.contact, ONE_DAYS_AGO[1]);
        }
      } else if (TOW_DAYS_AGO[0] === BERTH_DAY) {
        Logger.warn("2일 남음");
        for (const userInfo of userInfoList) {
          sendMessage(userInfo.contact, TOW_DAYS_AGO[1]);
        }
      } else if (THREE_DAYS_AGO[0] === BERTH_DAY) {
        Logger.warn("3일 남음");
        for (const userInfo of userInfoList) {
          sendMessage(userInfo.contact, TOW_DAYS_AGO[1]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /** alramDayOfAgoSchedule 스케줄 Job */
  async checkBerthDaysAndAlramPush() {
    try {
      /** 선석 데이터 */
      const berthAllData = await this.findAllBerthData();

      for (const obj of berthAllData) {
        const userInfoList = await this.findUserInfoListForAlram(obj);
        await this.sendAlramOfDayAgo(userInfoList, obj);
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async alramDayOfAgoSchedule() {
    try {
      Logger.warn("::: alramDayOfAgoSchedule start... :::");
      await this.checkBerthDaysAndAlramPush();
      Logger.warn("::: alramDayOfAgoSchedule end... :::");
    } catch (error) {
      console.log(error);
    }
  }
}
