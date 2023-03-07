import { Injectable, Logger } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import seqeulize from "sequelize";
import { Utils } from "src/util/common.utils";

@Injectable()
export class AlramRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly util: Utils
  ) {}

  /** 페이징 SELECT */
  async findOne(
    oid: string,
    offset: number,
    trminlCode: string,
    isLastView: boolean,
    nicknameSearchKeyword: string
  ) {
    if (!nicknameSearchKeyword) nicknameSearchKeyword = "";
    else
      nicknameSearchKeyword =
        "AND name.nickname_01 LIKE '%" + nicknameSearchKeyword + "%'";

    try {
      if (typeof isLastView === "boolean" && isLastView) {
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
              INNER JOIN
          berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
              INNER JOIN
          user AS usr ON alram.user_oid = usr.oid
              INNER JOIN
          berth_info AS info ON berth.trminlCode = info.turminal_code
              LEFT JOIN
          ship_byname AS name ON alram.oid = name.alram_oid
      WHERE
          TRUE
              AND berth.trminlCode IN ('${trminlCode}')
              AND usr.oid = '${oid}'
              ${nicknameSearchKeyword}
              -- 출항일이 2일 지난 것만
              OR DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
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
              ORDER BY DATE_FORMAT(IF(LEFT(berth.csdhpPrarnde, 1) = '(', MID(berth.csdhpPrarnde, 2, 16), LEFT(berth.csdhpPrarnde, 19)), '%Y-%m-%d %H:%i') ASC
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
              INNER JOIN
          berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
              INNER JOIN
          user AS usr ON alram.user_oid = usr.oid
              INNER JOIN
          berth_info AS info ON berth.trminlCode = info.turminal_code
              LEFT JOIN
          ship_byname AS name ON alram.oid = name.alram_oid
      WHERE
          TRUE
              AND berth.trminlCode IN ('${trminlCode}')
              AND usr.oid = '${oid}'
              ${nicknameSearchKeyword}
              -- 현재 날짜 보다 큰 날짜의 출항일만
              AND DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                  MID(berth.tkoffPrarnde, 2, 16),
                  LEFT(berth.tkoffPrarnde, 19)),
              '%Y-%m-%d %H:%i') IN (IF(DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                      MID(berth.tkoffPrarnde, 2, 16),
                      LEFT(berth.tkoffPrarnde, 19)),
                  '%Y-%m-%d %H:%i') > DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i'),
              DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                      MID(berth.tkoffPrarnde, 2, 16),
                      LEFT(berth.tkoffPrarnde, 19)),
                  '%Y-%m-%d %H:%i'),
              NULL))
              ORDER BY DATE_FORMAT(IF(LEFT(berth.csdhpPrarnde, 1) = '(', MID(berth.csdhpPrarnde, 2, 16), LEFT(berth.csdhpPrarnde, 19)), '%Y-%m-%d %H:%i') ASC
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

  /** 페이징 total index 구하기 위한 SELECT */
  async findAll(
    oid: string,
    trminlCode: string,
    isLastView: boolean,
    nicknameSearchKeyword: string
  ) {
    if (!nicknameSearchKeyword) nicknameSearchKeyword = "";
    else
      nicknameSearchKeyword =
        "AND name.nickname_01 LIKE '%" + nicknameSearchKeyword + "%'";
    try {
      if (typeof isLastView === "boolean" && isLastView) {
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
                  INNER JOIN
              berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
                  INNER JOIN
              user AS usr ON alram.user_oid = usr.oid
                  INNER JOIN
              berth_info AS info ON berth.trminlCode = info.turminal_code
                  LEFT JOIN
              ship_byname AS name ON alram.oid = name.alram_oid
          WHERE
              TRUE
                  AND berth.trminlCode IN ('${trminlCode}')
                  AND usr.oid = '${oid}'
                  ${nicknameSearchKeyword}
                  -- 출항일이 2일 지난 것만
                  OR DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
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
                  ORDER BY DATE_FORMAT(IF(LEFT(berth.csdhpPrarnde, 1) = '(', MID(berth.csdhpPrarnde, 2, 16), LEFT(berth.csdhpPrarnde, 19)), '%Y-%m-%d %H:%i') ASC
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
                  INNER JOIN
              berthStat_schedule AS berth ON alram.schedule_oid = berth.oid
                  INNER JOIN
              user AS usr ON alram.user_oid = usr.oid
                  INNER JOIN
              berth_info AS info ON berth.trminlCode = info.turminal_code
                  LEFT JOIN
              ship_byname AS name ON alram.oid = name.alram_oid
          WHERE
              TRUE
                  AND berth.trminlCode IN ('${trminlCode}')
                  AND usr.oid = '${oid}'
                  ${nicknameSearchKeyword}
                  -- 현재 날짜 보다 큰 날짜의 출항일만
                  AND DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                      MID(berth.tkoffPrarnde, 2, 16),
                      LEFT(berth.tkoffPrarnde, 19)),
                  '%Y-%m-%d %H:%i') IN (IF(DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                          MID(berth.tkoffPrarnde, 2, 16),
                          LEFT(berth.tkoffPrarnde, 19)),
                      '%Y-%m-%d %H:%i') > DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i'),
                  DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                          MID(berth.tkoffPrarnde, 2, 16),
                          LEFT(berth.tkoffPrarnde, 19)),
                      '%Y-%m-%d %H:%i'),
                  NULL))
                  ORDER BY DATE_FORMAT(IF(LEFT(berth.csdhpPrarnde, 1) = '(', MID(berth.csdhpPrarnde, 2, 16), LEFT(berth.csdhpPrarnde, 19)), '%Y-%m-%d %H:%i') ASC
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
