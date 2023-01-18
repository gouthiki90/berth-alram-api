import { Injectable, Logger } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import seqeulize from "sequelize";

@Injectable()
export class AlramRepository {
  constructor(private readonly sequelize: Sequelize) {}

  async findOne(oid: string, offset: number, trminlCode: string) {
    try {
      const list = await this.sequelize.query(
        `
        SELECT 
        alram.oid AS alramOid,
        berth.*,
        CONCAT(trminlCode,
                '(',
                info.turminal_korea,
                ')') AS trminlCode,
      -- 출항일이랑 입항일 초 단위 빼기
        DATE_FORMAT(IF(LEFT(csdhpPrarnde, 1) = '(',
                    MID(csdhpPrarnde, 2, 16),
                    LEFT(csdhpPrarnde, 19)),
                '%Y-%m-%d %H:%i') AS csdhpPrarnde, -- 입항예정일
        DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
                    MID(tkoffPrarnde, 2, 16),
                    LEFT(tkoffPrarnde, 19)),
                '%Y-%m-%d %H:%i') AS tkoffPrarnde, -- 출항예정일
      -- 이전 입항일 초 단위 빼기
      DATE_FORMAT(IF(LEFT(previousCsdhpPrarnde, 1) = '(',
                  MID(previousCsdhpPrarnde, 2, 16),
                  LEFT(previousCsdhpPrarnde, 19)),
              '%Y-%m-%d %H:%i') AS previousCsdhpPrarnde, -- 이전입항예정일
        usr.user_id AS userId,
        usr.biz_name AS bizName,
        usr.manager_tel AS managerTel,
        usr.manager_name AS managerName,
        (SELECT 
                COUNT(*)
            FROM
                (SELECT 
                    *
                FROM
                    container
                WHERE
                    container_status = 1
                GROUP BY container_numnber, alram_oid) AS A
            WHERE
                A.alram_oid = alram.oid) AS finishCount, -- 완료 컨테이너 count
        (SELECT 
                COUNT(*)
            FROM
                (SELECT 
                    *
                FROM
                    container
                GROUP BY container_numnber, alram_oid) AS A
            WHERE
                A.alram_oid = alram.oid) AS conCount -- 전체 컨테이너 count
    FROM
        subscription_alram AS alram
            INNER JOIN
        berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
            INNER JOIN
        user AS usr ON alram.user_oid = usr.oid
            INNER JOIN
        berth_info AS info ON berth.trminlCode = info.turminal_code
    WHERE
        TRUE
            AND berth.trminlCode IN ('${trminlCode}')
            AND usr.oid = '${oid}'
            LIMIT ${offset}, 20
        `,
        {
          type: seqeulize.QueryTypes.SELECT,
        }
      );

      return list;
    } catch (error) {
      Logger.error(error);
    }
  }

  async findAll(oid: string, trminlCode: string) {
    try {
      const list = await this.sequelize.query(
        `
        SELECT 
        alram.oid AS alramOid,
        berth.*,
        CONCAT(trminlCode,
                '(',
                info.turminal_korea,
                ')') AS trminlCode,
      -- 출항일이랑 입항일 초 단위 빼기
        DATE_FORMAT(IF(LEFT(csdhpPrarnde, 1) = '(',
                    MID(csdhpPrarnde, 2, 16),
                    LEFT(csdhpPrarnde, 19)),
                '%Y-%m-%d %H:%i') AS csdhpPrarnde, -- 입항예정일
        DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
                    MID(tkoffPrarnde, 2, 16),
                    LEFT(tkoffPrarnde, 19)),
                '%Y-%m-%d %H:%i') AS tkoffPrarnde, -- 출항예정일
      -- 이전 입항일 초 단위 빼기
      DATE_FORMAT(IF(LEFT(previousCsdhpPrarnde, 1) = '(',
                  MID(previousCsdhpPrarnde, 2, 16),
                  LEFT(previousCsdhpPrarnde, 19)),
              '%Y-%m-%d %H:%i') AS previousCsdhpPrarnde, -- 이전입항예정일
        usr.user_id AS userId,
        usr.biz_name AS bizName,
        usr.manager_tel AS managerTel,
        usr.manager_name AS managerName,
        (SELECT 
                COUNT(*)
            FROM
                (SELECT 
                    *
                FROM
                    container
                WHERE
                    container_status = 1
                GROUP BY container_numnber, alram_oid) AS A
            WHERE
                A.alram_oid = alram.oid) AS finishCount, -- 완료 컨테이너 count
        (SELECT 
                COUNT(*)
            FROM
                (SELECT 
                    *
                FROM
                    container
                GROUP BY container_numnber, alram_oid) AS A
            WHERE
                A.alram_oid = alram.oid) AS conCount -- 전체 컨테이너 count
    FROM
        subscription_alram AS alram
            INNER JOIN
        berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
            INNER JOIN
        user AS usr ON alram.user_oid = usr.oid
            INNER JOIN
        berth_info AS info ON berth.trminlCode = info.turminal_code
    WHERE
        TRUE
            AND berth.trminlCode IN ('${trminlCode}')
            AND usr.oid = '${oid}'
        `,
        {
          type: seqeulize.QueryTypes.SELECT,
        }
      );

      return list;
    } catch (error) {
      Logger.error(error);
    }
  }
}
