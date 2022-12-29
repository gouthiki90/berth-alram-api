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
      carry_timing,
      (SELECT COUNT(B.cnt) FROM (SELECT COUNT(container.oid) AS cnt FROM container WHERE TRUE AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY CNTR_NO ORDER BY STATUS_DT, STATUS_TM DESC) AS B) AS conCount,
      (SELECT COUNT(A.cnt) FROM (SELECT COUNT(container.container_status) AS cnt from container WHERE TRUE AND container_status = 1 AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY CNTR_NO ORDER BY STATUS_DT, STATUS_TM DESC) AS A) AS finishCount
    FROM container AS con
    LEFT JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
    WHERE TRUE
    ${this.util.generator(whereArr, query)}
    GROUP BY CNTR_NO
    ORDER BY STATUS_DT, STATUS_TM DESC
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
      carry_timing,
      (SELECT COUNT(B.cnt) FROM (SELECT COUNT(container.oid) AS cnt FROM container WHERE TRUE AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY CNTR_NO ORDER BY STATUS_DT DESC) AS B) AS conCount,
      (SELECT COUNT(A.cnt) FROM (SELECT COUNT(container.container_status) AS cnt from container WHERE TRUE AND container_status = 1 AND berth_oid = '${berthOid}' AND alram_oid = '${alramOid}' GROUP BY CNTR_NO ORDER BY STATUS_DT DESC) AS A) AS finishCount
    FROM container AS con
    LEFT JOIN berthStat_schedule AS berth ON con.berth_oid = berth.oid
    WHERE TRUE
    ${this.util.generator(whereArr, query)}
    GROUP BY CNTR_NO
    ORDER BY STATUS_DT, STATUS_TM DESC
      `,
      { type: sequelize.QueryTypes.SELECT, replacements: query }
    );
  }
}
