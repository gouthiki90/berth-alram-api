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
        berth.oid,
        CONCAT(trminlCode, '(', info.turminal_korea, ')') AS trminlCode,
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
        DATE_FORMAT(IF(LEFT(csdhpPrarnde, 1) = '(',
          MID(csdhpPrarnde, 2, 16),
          LEFT(csdhpPrarnde, 19)),
        '%Y-%m-%d %H:%i') AS csdhpPrarnde,
        DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
          MID(tkoffPrarnde, 2, 16),
          LEFT(tkoffPrarnde, 19)),
        '%Y-%m-%d %H:%i') AS tkoffPrarnde
    FROM
    berthStat_schedule AS berth
    INNER JOIN berth_info AS info ON berth.trminlCode = info.turminal_code
    WHERE TRUE
      `,
      { type: sequelize.QueryTypes.SELECT }
    );
  }

  async findForPageInfo(offset: number, query: BerthQueryDto) {
    const whereArr = [
      ["AND berth.trminlCode = :trminlCode", query.trminlCode],
      [
        "AND DATE_FORMAT(IF(LEFT(berth.csdhpPrarnde, 1) = '(', MID(berth.csdhpPrarnde, 2, 10), LEFT(berth.csdhpPrarnde, 10)), '%Y-%m-%d %H:%i') BETWEEN :startDate AND :endDate",
        query.searchType === "1",
      ],
      [
        "AND DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(', MID(berth.tkoffPrarnde, 2, 10), LEFT(berth.tkoffPrarnde, 10)), '%Y-%m-%d %H:%i')  BETWEEN :startDate AND :endDate",
        query.searchType === "2",
      ],
    ];
    return await this.seqeulize.query(
      `
      SELECT 
        berth.oid,
        CONCAT(trminlCode, '(', info.turminal_korea, ')') AS trminlCode,
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
        DATE_FORMAT(IF(LEFT(csdhpPrarnde, 1) = '(',
          MID(csdhpPrarnde, 2, 16),
          LEFT(csdhpPrarnde, 19)),
          '%Y-%m-%d %H:%i') AS csdhpPrarnde,
      DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
        MID(tkoffPrarnde, 2, 16),
        LEFT(tkoffPrarnde, 19)),
        '%Y-%m-%d %H:%i') AS tkoffPrarnde
      FROM
      berthStat_schedule AS berth
      INNER JOIN berth_info AS info ON berth.trminlCode = info.turminal_code
      WHERE TRUE
      ${this.utils.generator(whereArr, query)}
      ORDER BY berth.csdhpPrarnde ASC
      LIMIT :offset, 20
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { offset: offset, ...query },
      }
    );
  }

  async findForPageInfoAll(query: BerthQueryDto) {
    const whereArr = [
      ["AND berth.trminlCode = :trminlCode", query.trminlCode],
      [
        "AND DATE_FORMAT(IF(LEFT(berth.csdhpPrarnde, 1) = '(', MID(berth.csdhpPrarnde, 2, 10), LEFT(berth.csdhpPrarnde, 10)), '%Y-%m-%d %H:%i') BETWEEN :startDate AND :endDate",
        query.searchType === "1",
      ],
      [
        "AND DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(', MID(berth.tkoffPrarnde, 2, 10), LEFT(berth.tkoffPrarnde, 10)), '%Y-%m-%d %H:%i')  BETWEEN :startDate AND :endDate",
        query.searchType === "2",
      ],
    ];
    return await this.seqeulize.query(
      `
      SELECT 
        berth.oid,
        CONCAT(trminlCode, '(', info.turminal_korea, ')') AS trminlCode,
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
        DATE_FORMAT(IF(LEFT(csdhpPrarnde, 1) = '(',
          MID(csdhpPrarnde, 2, 16),
          LEFT(csdhpPrarnde, 19)),
          '%Y-%m-%d %H:%i') AS csdhpPrarnde,
        DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
          MID(tkoffPrarnde, 2, 16),
          LEFT(tkoffPrarnde, 19)),
          '%Y-%m-%d %H:%i') AS tkoffPrarnde
        FROM
        berthStat_schedule AS berth
        INNER JOIN berth_info AS info ON berth.trminlCode = info.turminal_code
        WHERE TRUE
        ${this.utils.generator(whereArr, query)}
        ORDER BY berth.csdhpPrarnde ASC
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
        berth.oid,
        CONCAT(trminlCode, '(', info.turminal_korea, ')') AS trminlCode,
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
        DATE_FORMAT(IF(LEFT(csdhpPrarnde, 1) = '(',
          MID(csdhpPrarnde, 2, 16),
          LEFT(csdhpPrarnde, 19)),
          '%Y-%m-%d %H:%i') AS csdhpPrarnde,
        DATE_FORMAT(IF(LEFT(tkoffPrarnde, 1) = '(',
          MID(tkoffPrarnde, 2, 16),
          LEFT(tkoffPrarnde, 19)),
          '%Y-%m-%d %H:%i') AS tkoffPrarnde
      FROM
      berthStat_schedule AS berth
      INNER JOIN berth_info AS info ON berth.trminlCode = info.turminal_code
      WHERE TRUE
      AND berth.oid = $oid
      ORDER BY berth.csdhpPrarnde ASC
      `,
      { type: sequelize.QueryTypes.SELECT, bind: { oid: oid } }
    );
  }
}
