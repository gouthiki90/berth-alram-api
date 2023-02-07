import { Injectable, Logger } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { Utils } from "src/util/common.utils";
import sequelize from "sequelize";

@Injectable()
export class CommonScheduleRepository {
  constructor(
    private readonly utils: Utils,
    private readonly seqeulize: Sequelize
  ) {}

  /** 선석 스케줄 모두 select */
  async findAllScheduleToEverySite(query: any) {
    const { trminlCode, searchType } = query;
    try {
      const whereArr = [
        ["AND trminlCode = :trminlCode", trminlCode],
        [
          "AND IF(LEFT(csdhpPrarnde, 1) = '(', MID(csdhpPrarnde, 2, 10), LEFT(csdhpPrarnde, 10)) BETWEEN :startDate AND :endDate",
          searchType === "1",
        ],
        [
          "AND IF(LEFT(tkoffPrarnde, 1) = '(', MID(tkoffPrarnde, 2, 10), LEFT(tkoffPrarnde, 10)) BETWEEN :startDate AND :endDate",
          searchType === "2",
        ],
      ];
      return await this.seqeulize.query(
        `
            SELECT 
              berth.oid,
              berth.trminlCode,
              berth.berthCode,
              berth.trminlVoyg,
              berth.wtorcmpCode,
              berth.trminlShipnm,
              berth.shipRute,
              berth.csdhpDrc,
              berth.workStarDay,
              berth.workFiniDay,
              berth.carryFiniDay,
              berth.landngQy,
              berth.shipngQy,
              berth.reshmtQy,
              berth.predBerth,
              berth.shipment,
              berth.shifting,
              berth.createDate,
              berth.updateDate,
              info.is_new_port,
              IF(LEFT(csdhpPrarnde, 1) = '(',
                MID(csdhpPrarnde, 2, 16),
                LEFT(csdhpPrarnde, 19)) AS csdhpPrarnde,
            IF(LEFT(tkoffPrarnde, 1) = '(',
              MID(tkoffPrarnde, 2, 16),
              LEFT(tkoffPrarnde, 19)) AS tkoffPrarnde
            FROM
            berthStat_schedule AS berth
            WHERE TRUE
            ${this.utils.generator(whereArr, query)}
            ORDER BY berth.csdhpPrarnde ASC
            `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: query,
        }
      );
    } catch (error) {
      Logger.error(error);
    }
  }
}
