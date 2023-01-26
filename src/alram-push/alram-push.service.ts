import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import sequelize from "sequelize";
import { BerthPyDto } from "../alram-push/dto/berth.dto";
import { HttpService } from "@nestjs/axios";
import { Sequelize } from "sequelize-typescript";
import { berthInfo, berthStatSchedule, user } from "src/models";

@Injectable()
export class AlramPushService {
  constructor(
    private readonly httpService: HttpService,
    private readonly seqeulize: Sequelize
  ) {}

  /* #region common functions */

  /** 해당 모선항차를 구독한 유저들 */
  async findUserInfoListForAlram(obj: BerthPyDto) {
    try {
      const userInfoList = await this.seqeulize.query(
        `
            SELECT
              users.contact
            FROM subscription_alram AS alram
            INNER JOIN user AS users ON alram.user_oid = users.oid
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

  async findTurminalCarryTiming() {
    try {
      return await berthInfo.findAll();
    } catch (error) {
      Logger.error(error);
    }
  }

  /** 날짜에 따른 알람 푸쉬 */
  async sendAlramOfDayAgo(userInfoList: Array<user>, obj: BerthPyDto) {
    /** 오늘 날짜 */
    const TODAY = new Date();
    /** 선석 입항예정일 날짜에서 일자만 가져옴 */
    const BERTH_DAY = new Date(obj.csdhpPrarnde).getDate();
    /** 각 터미널의 사전입항예정일 */
    const CARRY_TIMING = [];
    /** 터미널마다 가지고 있는 사전입항예정일 find */
    const truminalTimingList = await this.findTurminalCarryTiming();

    for (const berthInfo of truminalTimingList) {
      if (berthInfo.turminalCode === obj.trminlCode) {
        /** 사전입항예정일에 따른 입항예정일 D-day 구하기 */
        const D_DAY = new Date(
          TODAY.setDate(TODAY.getDate() + BERTH_DAY)
        ).getDate();

        /** 같거나 사전입항예정일이 커야 함, 이전 것은 이미 지난 일 */
        // if (D_DAY <= berthInfo.carryTiming) {
        //   CARRY_TIMING.push(D_DAY, `${D_DAY}일`);
        // }
      }
    }

    Logger.debug({ CARRY_TIMING });

    const sendMessage = async (contact: string, comment: any) => {
      await this.httpService.axiosRef
        .post(
          `${process.env.MESSAGE_URL}`,
          {
            content: `${obj.trminlCode} 터미널의 ${obj.oid}(${obj.csdhpPrarnde}) 모선항차 입항시간이 ${comment} 전입니다.`,
            receivers: [`${contact}`],
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
    };

    Logger.debug("::: compare Date :::", {
      CARRY_TIMING,
      BERTH_DAY,
    });

    try {
      if (CARRY_TIMING.length > 0 && CARRY_TIMING[0] === BERTH_DAY) {
        Logger.warn(`${CARRY_TIMING[0]}일 남음`);
        for (const userInfo of userInfoList) {
          await sendMessage(userInfo.contact, CARRY_TIMING[1]);
        }
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException("메시지 전송에 실패했습니다.");
    }
  }

  /* #endregion */

  /** alramDayOfAgoSchedule 스케줄 Job */
  async checkBerthDaysAndAlramPush() {
    try {
      /** 선석 데이터 */
      const inAlramBerthDataList = await this.seqeulize.query(
        `
        SELECT 
          berth.oid,
          berth.trminlCode,
          IF(LEFT(berth.csdhpPrarnde, 1) = '(',
          MID(berth.csdhpPrarnde, 2, 16),
          LEFT(berth.csdhpPrarnde, 19)) AS csdhpPrarnde
        FROM subscription_alram AS alram
        INNER JOIN berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
          `,
        {
          type: sequelize.QueryTypes.SELECT,
          mapToModel: true,
          model: berthStatSchedule,
        }
      );

      if (inAlramBerthDataList) {
        for (const obj of inAlramBerthDataList) {
          const userInfoList = await this.findUserInfoListForAlram(obj);
          await this.sendAlramOfDayAgo(userInfoList, obj);
        }
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        "알람을 전송하는 데에 실패했습니다."
      );
    }
  }
}
