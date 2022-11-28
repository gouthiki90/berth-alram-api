import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import seqeulize from "sequelize";

@Injectable()
export class AlramRepository {
  constructor(private readonly sequelize: Sequelize) {}

  async findOne(oid: string, offset: number) {
    try {
      const list = await this.sequelize.query(
        `
        SELECT
          alram.oid AS alramOid,
          berth.*,
          IF(LEFT(csdhpPrarnde, 1) = '(',
          MID(csdhpPrarnde, 2, 16),
          LEFT(csdhpPrarnde, 19)) AS csdhpPrarnde,
          IF(LEFT(tkoffPrarnde, 1) = '(',
          MID(tkoffPrarnde, 2, 16),
          LEFT(tkoffPrarnde, 19)) AS tkoffPrarnde,
          usr.user_id AS userId,
          usr.biz_name AS bizName,
          usr.manager_tel AS managerTel,
          usr.manager_name AS managerName
        FROM subscription_alram AS alram
        LEFT JOIN berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
        LEFT JOIN user AS usr ON alram.user_oid = usr.oid
        WHERE TRUE
        AND usr.oid = $oid
        LIMIT $offset, 20
        `,
        {
          type: seqeulize.QueryTypes.SELECT,
          bind: { oid: oid, offset: offset },
        }
      );

      return list;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(oid: string) {
    try {
      const list = await this.sequelize.query(
        `
        SELECT
          alram.oid AS alramOid,
          berth.*,
          IF(LEFT(csdhpPrarnde, 1) = '(',
          MID(csdhpPrarnde, 2, 16),
          LEFT(csdhpPrarnde, 19)) AS csdhpPrarnde,
          IF(LEFT(tkoffPrarnde, 1) = '(',
          MID(tkoffPrarnde, 2, 16),
          LEFT(tkoffPrarnde, 19)) AS tkoffPrarnde,
          usr.user_id AS userId,
          usr.biz_name AS bizName,
          usr.manager_tel AS managerTel,
          usr.manager_name AS managerName
        FROM subscription_alram AS alram
        LEFT JOIN berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
        LEFT JOIN user AS usr ON alram.user_oid = usr.oid
        WHERE TRUE
        AND usr.oid = $oid
        `,
        {
          type: seqeulize.QueryTypes.SELECT,
          bind: { oid: oid },
        }
      );

      return list;
    } catch (error) {
      console.log(error);
    }
  }
}
