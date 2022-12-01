import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { berthStatSchedule, user } from "src/models";
import { CreateBerthPyDto } from "./dto/create-berth-py.dto";
import { HttpService } from "@nestjs/axios";
import sequelize from "sequelize";

@Injectable()
export class BerthPyService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly httpService: HttpService
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
            content: `${obj.trminlCode} 터미널의 입항시간이 ${berthDupleData.csdhpPrarnde}에서 ${obj.csdhpPrarnde}으로 변경되었습니다.`,
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

  /** 날짜에 따른 알람 푸쉬 */
  async sendAlramOfDayAgo(userInfoList: Array<user>, obj: CreateBerthPyDto) {
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
        console.log("1일 남음");
        for (const userInfo of userInfoList) {
          sendMessage(userInfo.contact, ONE_DAYS_AGO[1]);
        }
      } else if (TOW_DAYS_AGO[0] === BERTH_DAY) {
        console.log("2일 남음");
        for (const userInfo of userInfoList) {
          sendMessage(userInfo.contact, TOW_DAYS_AGO[1]);
        }
      } else if (THREE_DAYS_AGO[0] === BERTH_DAY) {
        console.log("3일 남음");
        for (const userInfo of userInfoList) {
          sendMessage(userInfo.contact, TOW_DAYS_AGO[1]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async create(data: Array<CreateBerthPyDto>) {
    const t = await this.seqeulize.transaction();
    try {
      for (const obj of data) {
        // duple check
        const berthDupleData = await this.findOneForDupleData(obj.oid);

        /** 알람을 구독한 유저 리스트 */
        const userInfoList = await this.findUserInfoListForAlram(obj);

        if (berthDupleData) {
          await berthStatSchedule.update(obj, {
            where: { oid: obj.oid },
            transaction: t,
          });

          if (berthDupleData.csdhpPrarnde !== obj.csdhpPrarnde) {
            console.log(`csdhpPrarnde=${obj.csdhpPrarnde} ::: is change! :::`);

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

        /** 날짜에 따른 문자 전송 */
        await this.sendAlramOfDayAgo(userInfoList, obj);
      }

      await t.commit();
    } catch (error) {
      console.log(error);
    }
  }
}
