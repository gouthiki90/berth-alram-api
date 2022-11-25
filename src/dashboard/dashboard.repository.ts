import sequelize from "sequelize";
import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { BerthQueryDto } from "./dto/berth-query.dto";
import { Utils } from "src/util/common.utils";

@Injectable()
export class DashBoardRepository {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly utils: Utils
  ) {}

  async findAll() {
    return await this.seqeulize.query(
      `
      SELECT 
          oid,
          trminlCode,
          berthCode,
          trminlVoyg,
          wtorcmpCode,
          trminlShipnm,
          shipRute,
          csdhpDrc,
          workStarDay,
          workFiniDay,
          carryFiniDay,
          landngQy,
          shipngQy,
          reshmtQy,
          predBerth,
          shipment,
          shifting,
          createDate,
          updateDate,
          IF(LEFT(csdhpPrarnde, 1) = '(',
              MID(csdhpPrarnde, 2, 16),
              LEFT(csdhpPrarnde, 19)) AS csdhpPrarnde,
          IF(LEFT(tkoffPrarnde, 1) = '(',
              MID(tkoffPrarnde, 2, 16),
              LEFT(tkoffPrarnde, 19)) AS tkoffPrarnde
        FROM
        berthStat_schedule
        WHERE TRUE
      `,
      { type: sequelize.QueryTypes.SELECT }
    );
  }

  async findForPageInfo(pageIndex: number, query: BerthQueryDto) {
    const whereArr = [
      ["AND trminlCode = :trminlCode", query.trminlCode],
      [
        "AND IF(LEFT(csdhpPrarnde, 1) = '(', MID(csdhpPrarnde, 2, 10), LEFT(csdhpPrarnde, 10)) BETWEEN :startDate AND :endDate",
        query.searchType === "1",
      ],
      [
        "AND IF(LEFT(tkoffPrarnde, 1) = '(', MID(tkoffPrarnde, 2, 10), LEFT(tkoffPrarnde, 10)) BETWEEN :startDate AND :endDate",
        query.searchType === "2",
      ],
    ];
    return await this.seqeulize.query(
      `
          SELECT 
              oid,
              trminlCode,
              berthCode,
              trminlVoyg,
              wtorcmpCode,
              trminlShipnm,
              shipRute,
              csdhpDrc,
              workStarDay,
              workFiniDay,
              carryFiniDay,
              landngQy,
              shipngQy,
              reshmtQy,
              predBerth,
              shipment,
              shifting,
              createDate,
              updateDate,
              IF(LEFT(csdhpPrarnde, 1) = '(',
                  MID(csdhpPrarnde, 2, 16),
                  LEFT(csdhpPrarnde, 19)) AS csdhpPrarnde,
              IF(LEFT(tkoffPrarnde, 1) = '(',
                  MID(tkoffPrarnde, 2, 16),
                  LEFT(tkoffPrarnde, 19)) AS tkoffPrarnde
            FROM
            berthStat_schedule
            WHERE TRUE
            ${this.utils.generator(whereArr, query)}
            LIMIT :pageIndex, 20
          `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { pageIndex: pageIndex, ...query },
      }
    );
  }

  async findForPageInfoAll(query: BerthQueryDto) {
    const whereArr = [
      ["AND trminlCode = :trminlCode", query.trminlCode],
      [
        "AND IF(LEFT(csdhpPrarnde, 1) = '(', MID(csdhpPrarnde, 2, 10), LEFT(csdhpPrarnde, 10)) BETWEEN :startDate AND :endDate",
        query.searchType === "1",
      ],
      [
        "AND IF(LEFT(tkoffPrarnde, 1) = '(', MID(tkoffPrarnde, 2, 10), LEFT(tkoffPrarnde, 10)) BETWEEN :startDate AND :endDate",
        query.searchType === "2",
      ],
    ];
    return await this.seqeulize.query(
      `
          SELECT 
              oid,
              trminlCode,
              berthCode,
              trminlVoyg,
              wtorcmpCode,
              trminlShipnm,
              shipRute,
              csdhpDrc,
              workStarDay,
              workFiniDay,
              carryFiniDay,
              landngQy,
              shipngQy,
              reshmtQy,
              predBerth,
              shipment,
              shifting,
              createDate,
              updateDate,
              IF(LEFT(csdhpPrarnde, 1) = '(',
                  MID(csdhpPrarnde, 2, 16),
                  LEFT(csdhpPrarnde, 19)) AS csdhpPrarnde,
              IF(LEFT(tkoffPrarnde, 1) = '(',
                  MID(tkoffPrarnde, 2, 16),
                  LEFT(tkoffPrarnde, 19)) AS tkoffPrarnde
            FROM
            berthStat_schedule
            WHERE TRUE
            ${this.utils.generator(whereArr, query)}
          `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { ...query },
      }
    );
  }

  async findOne(oid: string) {
    return await this.seqeulize.query(
      `
      SELECT 
      oid,
      trminlCode,
      berthCode,
      trminlVoyg,
      wtorcmpCode,
      trminlShipnm,
      shipRute,
      csdhpDrc,
      workStarDay,
      workFiniDay,
      carryFiniDay,
      landngQy,
      shipngQy,
      reshmtQy,
      predBerth,
      shipment,
      shifting,
      createDate,
      updateDate,
      IF(LEFT(csdhpPrarnde, 1) = '(',
          MID(csdhpPrarnde, 2, 16),
          LEFT(csdhpPrarnde, 19)) AS csdhpPrarnde,
      IF(LEFT(tkoffPrarnde, 1) = '(',
          MID(tkoffPrarnde, 2, 16),
          LEFT(tkoffPrarnde, 19)) AS tkoffPrarnde
    FROM
    berthStat_schedule
    WHERE TRUE
    AND oid = $oid
      `,
      { type: sequelize.QueryTypes.SELECT, bind: { oid: oid } }
    );
  }
}
