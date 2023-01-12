import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import sequelize from "sequelize";
import { Utils } from "src/util/common.utils";
import { container } from "src/models";

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
      con.container_numnber,
      con.container_status,
      con.is_danger,
      (SELECT COUNT(B.cnt) FROM (SELECT COUNT(container.oid) AS cnt FROM container WHERE TRUE AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY container_numnber ORDER BY create_date DESC) AS B) AS conCount,
      (SELECT COUNT(A.cnt) FROM (SELECT COUNT(container.container_status) AS cnt from container WHERE TRUE AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY container_numnber ORDER BY create_date DESC) AS A) AS finishCount
    FROM container AS con
    LEFT JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
    WHERE TRUE
    ${this.util.generator(whereArr, query)}
    ORDER BY create_date DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: query,
        mapToModel: true,
        model: container,
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
      con.container_numnber,
      con.container_status,
      con.is_danger,
      (SELECT COUNT(B.cnt) FROM (SELECT COUNT(container.oid) AS cnt FROM container WHERE TRUE AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY container_numnber ORDER BY create_date DESC) AS B) AS conCount,
      (SELECT COUNT(A.cnt) FROM (SELECT COUNT(container.container_status) AS cnt from container WHERE TRUE AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY container_numnber ORDER BY create_date DESC) AS A) AS finishCount
    FROM container AS con
    LEFT JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
    WHERE TRUE
    ${this.util.generator(whereArr, query)}
    ORDER BY create_date DESC
      `,
      { type: sequelize.QueryTypes.SELECT, replacements: query }
    );
  }
}
