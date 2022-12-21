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
        usr.manager_name AS managerName,
        (
          SELECT COUNT(*) 
          FROM 
			(
				SELECT * 
                FROM container 
                WHERE container_status = 1 
                GROUP BY CNTR_NO, alram_oid ORDER BY STATUS_DT, STATUS_TM DESC
			) AS A
            where A.alram_oid = alram.oid
        ) AS finishCount,
        (
          SELECT COUNT(*)
          FROM
			(
				SELECT *
                FROM container
                GROUP BY CNTR_NO, alram_oid
                ORDER BY STATUS_DT, STATUS_TM DESC
          ) AS A
          WHERE A.alram_oid = alram.oid
        ) AS conCount,
      FROM subscription_alram AS alram
      LEFT 
      JOIN berthStat_schedule AS berth 
        ON alram.schedule_oid = berth.oid
      LEFT 
      JOIN user AS usr 
        ON alram.user_oid = usr.oid
      WHERE TRUE
      AND usr.oid = '${oid}'
        LIMIT ${offset}, 20
        `,
        {
          type: seqeulize.QueryTypes.SELECT,
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
        usr.manager_name AS managerName,
        (
          SELECT COUNT(*) 
          FROM 
			(
				SELECT * 
                FROM container 
                WHERE container_status = 1 
                GROUP BY CNTR_NO, alram_oid ORDER BY STATUS_DT, STATUS_TM DESC
			) AS A
            where A.alram_oid = alram.oid
        ) AS finishCount,
        (
          SELECT COUNT(*)
          FROM
			(
				SELECT *
                FROM container
                GROUP BY CNTR_NO, alram_oid
                ORDER BY STATUS_DT, STATUS_TM DESC
          ) AS A
          WHERE A.alram_oid = alram.oid
        ) AS conCount,
      FROM subscription_alram AS alram
      LEFT 
      JOIN berthStat_schedule AS berth 
        ON alram.schedule_oid = berth.oid
      LEFT 
      JOIN user AS usr 
        ON alram.user_oid = usr.oid
      WHERE TRUE
      AND usr.oid = '${oid}'
        `,
        {
          type: seqeulize.QueryTypes.SELECT,
        }
      );

      return list;
    } catch (error) {
      console.log(error);
    }
  }
}
