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
      con.container_status, -- 대기/완료 상태값
      con.is_danger, -- 위험물/일바 상태값
      (SELECT COUNT(B.cnt) FROM (SELECT COUNT(container.oid) AS cnt FROM container WHERE TRUE AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY container_numnber ORDER BY create_date DESC) AS B) AS conCount, -- 전체 컨테이너
      (SELECT COUNT(A.cnt) FROM (SELECT COUNT(container.container_status) AS cnt from container WHERE TRUE AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY container_numnber ORDER BY create_date DESC) AS A) AS finishCount -- 마감된 컨테이너
    FROM container AS con
    INNER JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
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
    INNER JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
    WHERE TRUE
    ${this.util.generator(whereArr, query)}
    ORDER BY create_date DESC
      `,
      { type: sequelize.QueryTypes.SELECT, replacements: query }
    );
  }
}
