import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import sequelize from "sequelize";
import { Utils } from "src/util/common.utils";

@Injectable()
export class ContainersReposiotry {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly util: Utils
  ) {}

  async findAll() {
    return await this.sequelize.query(
      `
      SELECT
        con.oid,
        con.CAR_CODE,
        con.OUTGATE_CY,
        con.CNTR_NO,
        con.OUTGATE_TIME,
        con.STATUS_DT,
        con.STATUS_NM,
        con.CNTR_STATUS,
        con.TERMINAL_NAME,
        con.STATUS_TM,
        con.container_status,
        (SELECT COUNT(container_status) FROM container WHERE berth_oid = berth.oid AND container_status = 1) AS finishCount,
        (SELECT COUNT(oid) FROM container WHERE berth_oid = berth.oid AND container_status = 1) AS conCount
      FROM container AS con
      LEFT JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
      WHERE TRUE
      AND con.STATUS_NM LIKE '%반입%'
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
  }

  async findOne(query: any) {
    const { berthOid, alramOid } = query;
    const whereArr = [
      ["AND con.STATUS_NM LIKE '%반입%'", true],
      ["AND berth.oid = :berthOid", berthOid],
      ["AND con.alram_oid = :alramOid", alramOid],
    ];
    return await this.sequelize.query(
      `
      SELECT
        con.oid,
        con.CAR_CODE,
        con.OUTGATE_CY,
        con.CNTR_NO,
        con.OUTGATE_TIME,
        con.STATUS_DT,
        con.STATUS_NM,
        con.CNTR_STATUS,
        con.TERMINAL_NAME,
        con.STATUS_TM,
        con.container_status,
        (SELECT COUNT(container_status) FROM container WHERE berth_oid = berth.oid AND container_status = 1) AS finishCount,
        (SELECT COUNT(oid) FROM container WHERE berth_oid = berth.oid AND container_status = 1) AS conCount
      FROM container AS con
      LEFT JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
      WHERE TRUE
      AND con.STATUS_NM LIKE '%반입%'
    ${this.util.generator(whereArr, query)}
      `,
      { type: sequelize.QueryTypes.SELECT, replacements: query }
    );
  }
}
