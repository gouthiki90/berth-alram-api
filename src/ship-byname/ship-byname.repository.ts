import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import seqelize from "sequelize";
import { FindShipBynameQueryDto } from "./dto/find-ship-byname-qeury.dto";

@Injectable()
export class ShipBynameRepository {
  constructor(private readonly seqelize: Sequelize) {}

  /** 각 유저가 수정할 수 있는 모선명 모달 select */
  async findOneForSubscripUser(query: FindShipBynameQueryDto) {
    try {
      return await this.seqelize.query(
        `
        SELECT
            shipName.oid, -- 키값
            shipName.nickname_01, -- 별칭1
            shipName.nickname_02, -- 별칭2
            shipName.nickname_03, -- 별칭3
            shipName.is_use, -- 사용여부
            usr.oid AS userOid, -- 유저 키값
            berth.oid AS berthOid, -- 선석 스케줄 키값
            berth.trminlShipnm, -- 스케줄 원본 모선명
            alram.oid AS alramOid -- 알람 구독 키값
        FROM
            ship_byname AS shipName
            INNER JOIN
                user AS usr
                ON shipName.user_oid = usr.oid -- 유저
            INNER JOIN
                bertStat_schedule AS berth
                ON shipName.schedule_oid = berth.oid -- 선석 스케줄
            INNER JOIN
                subscription_alram AS alram
                ON shipName.alram_oid = alram.oid -- 알람 구독
            WHERE TRUE
                AND usr = $userOid
                AND alram = $alramOid
        `,
        {
          type: seqelize.QueryTypes.SELECT,
          bind: { userOid: query.userOid, alramOid: query.alramOid },
        }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }
}
