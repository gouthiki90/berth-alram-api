import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import sequelize from "sequelize";
import { Utils } from "src/util/common.utils";

@Injectable()
export class ContainersReposiotry {
  constructor(private readonly sequelize: Sequelize) {}

  async findAll() {
    return await this.sequelize.query(
      `
      SELECT
        con.id,
        con.CAR_CODE,
        con.OUTGATE_CY,
        con.CNTR_NO,
        con.OUTGATE_TIME,
        con.STATUS_DT,
        con.STATUS_NM,
        con.CNTR_STATUS,
        con.TERMINAL_NAME,
        con.STATUS_TM,
        (SELECT COUNT(container_status) FROM container WHERE container_status = 1) AS finishCount,
        (SELECT COUNT(id) FROM container WHERE berth_oid = berth.oid) AS conCount
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
}
