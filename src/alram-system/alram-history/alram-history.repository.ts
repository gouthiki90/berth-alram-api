import { Injectable, NotFoundException } from "@nestjs/common";
import seqeulize from "sequelize";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class AlramHistoryRepository {
  constructor(private readonly seqeulize: Sequelize) {}

  async findOneOfUserAlramHistory(userOid: string) {
    try {
      return await this.seqeulize.query(
        `
        SELECT
          *
        FROM alram_history
        WHERE TRUE
        AND user_oid = $oid
        `,
        { type: seqeulize.QueryTypes.SELECT, bind: { oid: userOid } }
      );
    } catch (error) {
      console.log(error);
      throw new NotFoundException("데이터를 찾을 수 없습니다.");
    }
  }

  async findOneAlramHistoryCount(userOid: string) {
    try {
      /** 각 유저가 받은 알람 수 */
      const alramHistoryCountData = await this.seqeulize.query(
        `
        SELECT
          COUNT(*) AS alramLength
        FROM alram_history
        WHERE TRUE
        AND user_oid = $oid
        AND is_read = '0'
        `,
        { type: seqeulize.QueryTypes.SELECT, bind: { oid: userOid } }
      );

      return alramHistoryCountData[0];
    } catch (error) {
      console.log(error);
      throw new NotFoundException("데이터를 찾을 수 없습니다.");
    }
  }
}
