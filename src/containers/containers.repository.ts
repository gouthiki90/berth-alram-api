import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import sequelize from "sequelize";

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
        (SELECT COUNT(container_status) FROM containers WHERE container_status = 1) AS finishCount,
        (SELECT COUNT(id) FROM containers WHERE berthOid = berth.oid) AS conCount
      FROM containers AS con
      LEFT JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
  }
}