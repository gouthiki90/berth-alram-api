import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Sequelize } from "sequelize-typescript";
import { alramHistory } from "src/models";
import { UpdateAlramHistoryDto } from "./dto/update-alram-history.dto";

@Injectable()
export class AlramHistoryService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  /** DELETE를 위한 SELECT */
  async findAllForRemoveAlramHistory() {
    try {
      return await alramHistory.findAll();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("조회 실패");
    }
  }

  /** 읽음/안읽음 update */
  async update(dto: UpdateAlramHistoryDto) {
    const t = await this.seqeulize.transaction();
    try {
      await alramHistory.update(
        { isRead: dto.isRead },
        { where: { oid: dto.oid }, transaction: t }
      );

      const result = await t.commit();
      return result;
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw new InternalServerErrorException(`${error} UPDATE Error!`);
    }
  }

  /** 알람 히스토리 삭제 function for schedule */
  async removeScheduleFuntion() {
    const t = await this.seqeulize.transaction();
    try {
      const REMOVE_DATA = await this.findAllForRemoveAlramHistory();

      if (REMOVE_DATA.length === 0) {
        return;
      }

      for (const obj of REMOVE_DATA) {
        await alramHistory.destroy({
          where: { oid: obj.oid, isRead: 1 },
          transaction: t,
        });
      }

      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw new InternalServerErrorException(`${error} DELETE Error!`);
    }
  }

  /** 매주 주말마다 삭제 */
  @Cron(CronExpression.EVERY_WEEKEND, {
    name: "removeAlramHistorySchedule",
  })
  async removeAlramHistorySchedule() {
    try {
      Logger.warn("::: removeAlramHistorySchedule start... :::");
      await this.removeScheduleFuntion();
      Logger.warn("::: removeAlramHistorySchedule end... :::");
    } catch (error) {
      Logger.error(`::: removeAlramHistorySchedule Error! :::`);
      console.log(error);
      const GET_JOB = this.schedulerRegistry.getCronJob(
        "removeAlramHistorySchedule"
      );
      GET_JOB.stop();
    }
  }
}
