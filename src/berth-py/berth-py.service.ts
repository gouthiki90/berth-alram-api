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

  async findOneForDupleData(oid: string) {
    try {
      return await berthStatSchedule.findOne({ where: { oid: oid } });
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

        if (berthDupleData) {
          await berthStatSchedule.update(obj, {
            where: { oid: obj.oid },
            transaction: t,
          });

          if (berthDupleData.csdhpPrarnde !== obj.csdhpPrarnde) {
            console.log(`csdhpPrarnde=${obj.csdhpPrarnde} ::: is change! :::`);

            /** 해당 모선항차를 구독한 유저들 */
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
}
