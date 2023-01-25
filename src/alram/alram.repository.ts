import { Injectable, Logger } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import seqeulize from "sequelize";

@Injectable()
export class AlramRepository {
  constructor(private readonly sequelize: Sequelize) {}

  async findOne(
    oid: string,
    offset: number,
    trminlCode: string,
    isLastView: boolean
  ) {
    try {
      if (typeof isLastView === typeof "boolean" && isLastView) {
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
                  '%Y-%m-%d %H:%i') AS csdhpPrarnde,
          DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
                      MID(tkoffPrarnde, 2, 16),
                      LEFT(tkoffPrarnde, 19)),
                  '%Y-%m-%d %H:%i') AS tkoffPrarnde,
        -- 이전 입항일 초 단위 빼기
        DATE_FORMAT(IF(LEFT(previousCsdhpPrarnde, 1) = '(',
                    MID(previousCsdhpPrarnde, 2, 16),
                    LEFT(previousCsdhpPrarnde, 19)),
                '%Y-%m-%d %H:%i') AS previousCsdhpPrarnde,
          usr.user_id AS userId,
          usr.biz_name AS bizName,
          usr.manager_tel AS managerTel,
          usr.manager_name AS managerName,
          (SELECT COUNT(*) FROM container WHERE alram_oid = alram.oid) AS conCount,
          (SELECT COUNT(*) FROM container WHERE container_status = 1 AND alram_oid = alram.oid) AS finishCount
      FROM
          subscription_alram AS alram
              LEFT JOIN
          berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
              LEFT JOIN
          user AS usr ON alram.user_oid = usr.oid
              LEFT JOIN
          berth_info AS info ON berth.trminlCode = info.turminal_code
      WHERE
          TRUE
              AND berth.trminlCode IN ('${trminlCode}')
              AND usr.oid = '${oid}'
              -- 출항일이 2일 지난 것만
              AND DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                  MID(berth.tkoffPrarnde, 2, 16),
                  LEFT(berth.tkoffPrarnde, 19)),
              '%Y-%m-%d %H:%i') IN (IF(DATE_ADD(DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                      MID(berth.tkoffPrarnde, 2, 16),
                      LEFT(berth.tkoffPrarnde, 19)),
                  '%Y-%m-%d %H:%i'), INTERVAL 2 DAY) < DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i'),
              DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                      MID(berth.tkoffPrarnde, 2, 16),
                      LEFT(berth.tkoffPrarnde, 19)),
                  '%Y-%m-%d %H:%i'),
              NULL))
              LIMIT ${offset}, 20
          `,
          {
            type: seqeulize.QueryTypes.SELECT,
          }
        );

        return list;
      } else {
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
                  '%Y-%m-%d %H:%i') AS csdhpPrarnde,
          DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
                      MID(tkoffPrarnde, 2, 16),
                      LEFT(tkoffPrarnde, 19)),
                  '%Y-%m-%d %H:%i') AS tkoffPrarnde,
        -- 이전 입항일 초 단위 빼기
        DATE_FORMAT(IF(LEFT(previousCsdhpPrarnde, 1) = '(',
                    MID(previousCsdhpPrarnde, 2, 16),
                    LEFT(previousCsdhpPrarnde, 19)),
                '%Y-%m-%d %H:%i') AS previousCsdhpPrarnde,
          usr.user_id AS userId,
          usr.biz_name AS bizName,
          usr.manager_tel AS managerTel,
          usr.manager_name AS managerName,
          (SELECT COUNT(*) FROM container WHERE alram_oid = alram.oid) AS conCount,
          (SELECT COUNT(*) FROM container WHERE container_status = 1 AND alram_oid = alram.oid) AS finishCount
      FROM
          subscription_alram AS alram
              LEFT JOIN
          berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
              LEFT JOIN
          user AS usr ON alram.user_oid = usr.oid
              LEFT JOIN
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
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  async findAll(oid: string, trminlCode: string, isLastView: boolean) {
    try {
      if (typeof isLastView === typeof "boolean" && isLastView) {
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
                      '%Y-%m-%d %H:%i') AS csdhpPrarnde,
              DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
                          MID(tkoffPrarnde, 2, 16),
                          LEFT(tkoffPrarnde, 19)),
                      '%Y-%m-%d %H:%i') AS tkoffPrarnde,
            -- 이전 입항일 초 단위 빼기
            DATE_FORMAT(IF(LEFT(previousCsdhpPrarnde, 1) = '(',
                        MID(previousCsdhpPrarnde, 2, 16),
                        LEFT(previousCsdhpPrarnde, 19)),
                    '%Y-%m-%d %H:%i') AS previousCsdhpPrarnde,
              usr.user_id AS userId,
              usr.biz_name AS bizName,
              usr.manager_tel AS managerTel,
              usr.manager_name AS managerName,
              (SELECT COUNT(*) FROM container WHERE alram_oid = alram.oid) AS conCount,
              (SELECT COUNT(*) FROM container WHERE container_status = 1 AND alram_oid = alram.oid) AS finishCount
          FROM
              subscription_alram AS alram
                  LEFT JOIN
              berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
                  LEFT JOIN
              user AS usr ON alram.user_oid = usr.oid
                  LEFT JOIN
              berth_info AS info ON berth.trminlCode = info.turminal_code
          WHERE
              TRUE
                  AND berth.trminlCode IN ('${trminlCode}')
                  AND usr.oid = '${oid}'
                  -- 출항일이 3일 지난 것만
                  AND DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                      MID(berth.tkoffPrarnde, 2, 16),
                      LEFT(berth.tkoffPrarnde, 19)),
                  '%Y-%m-%d %H:%i') IN (IF(DATE_ADD(DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                          MID(berth.tkoffPrarnde, 2, 16),
                          LEFT(berth.tkoffPrarnde, 19)),
                      '%Y-%m-%d %H:%i'), INTERVAL 2 DAY) < DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i'),
                  DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                          MID(berth.tkoffPrarnde, 2, 16),
                          LEFT(berth.tkoffPrarnde, 19)),
                      '%Y-%m-%d %H:%i'),
                  NULL))
          `,
          {
            type: seqeulize.QueryTypes.SELECT,
          }
        );

        return list;
      } else {
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
                      '%Y-%m-%d %H:%i') AS csdhpPrarnde,
              DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
                          MID(tkoffPrarnde, 2, 16),
                          LEFT(tkoffPrarnde, 19)),
                      '%Y-%m-%d %H:%i') AS tkoffPrarnde,
            -- 이전 입항일 초 단위 빼기
            DATE_FORMAT(IF(LEFT(previousCsdhpPrarnde, 1) = '(',
                        MID(previousCsdhpPrarnde, 2, 16),
                        LEFT(previousCsdhpPrarnde, 19)),
                    '%Y-%m-%d %H:%i') AS previousCsdhpPrarnde,
              usr.user_id AS userId,
              usr.biz_name AS bizName,
              usr.manager_tel AS managerTel,
              usr.manager_name AS managerName,
              (SELECT COUNT(*) FROM container WHERE alram_oid = alram.oid) AS conCount,
              (SELECT COUNT(*) FROM container WHERE container_status = 1 AND alram_oid = alram.oid) AS finishCount
          FROM
              subscription_alram AS alram
                  LEFT JOIN
              berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
                  LEFT JOIN
              user AS usr ON alram.user_oid = usr.oid
                  LEFT JOIN
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
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}
