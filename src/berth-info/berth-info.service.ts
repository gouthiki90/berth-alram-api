import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { berthInfo } from "src/models";
import { EditTimingFromAdminDto } from "./dto/edit-timing-from-user.dto";

@Injectable()
export class BerthInfoService {
  constructor(private readonly seqeulize: Sequelize) {}

  async editTiming(editTimingFromAdminDto: EditTimingFromAdminDto) {
    /** 항만 admin userId들 */
    const ADMIN_USER_ID = ["gouthiki90", "ttt3f", "hello"];

    const t = await this.seqeulize.transaction();
    try {
      if (ADMIN_USER_ID.includes(editTimingFromAdminDto.userId)) {
        await berthInfo.update(
          { carryTiming: editTimingFromAdminDto.carryTiming },
          {
            where: { oid: editTimingFromAdminDto.oid },
            transaction: t,
          }
        );
      }

      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw new InternalServerErrorException("사전반입일 데이터 수정 실패");
    }
  }
}
