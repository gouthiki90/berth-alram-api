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

  async findAll(query: any) {
    const { berthOid, alramOid } = query;
    const whereArr = [
      ["AND berth.oid = :berthOid", berthOid],
      ["AND con.alram_oid = :alramOid", alramOid],
    ];
    return await this.sequelize.query(
      `
      SELECT
      con.oid,
      con.is_danger,
      con.container_numnber,
      con.container_status,
      con.remark,
      (SELECT COUNT(*) FROM container WHERE con.berth_oid = '${berthOid}' AND con.alram_oid = '${alramOid}') AS conCount,
      (SELECT COUNT(*) FROM container WHERE container_status = 1 AND con.berth_oid = '${berthOid}' AND con.alram_oid = '${alramOid}') AS finishCount
    FROM container AS con
    LEFT JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
    WHERE TRUE
    ${this.util.generator(whereArr, query)}
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: query,
      }
    );
  }

  async findOne(query: any) {
    const { berthOid, alramOid } = query;
    const whereArr = [
      ["AND berth.oid = :berthOid", berthOid],
      ["AND con.alram_oid = :alramOid", alramOid],
    ];
    return await this.sequelize.query(
      `
      SELECT
      con.oid,
      con.is_danger,
      con.container_numnber,
      con.container_status,
      con.remark,
      (SELECT COUNT(*) FROM container WHERE con.berth_oid = '${berthOid}' AND con.alram_oid = '${alramOid}') AS conCount,
      (SELECT COUNT(*) FROM container WHERE container_status = 1 AND con.berth_oid = '${berthOid}' AND con.alram_oid = '${alramOid}') AS finishCount
    FROM container AS con
    LEFT JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
    WHERE TRUE
    ${this.util.generator(whereArr, query)}
      `,
      { type: sequelize.QueryTypes.SELECT, replacements: query }
    );
  }
}
