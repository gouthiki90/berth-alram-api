import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { alramHistory } from "src/models";
import { UpdateAlramHistoryDto } from "./dto/update-alram-history.dto";
import seqeulize from "sequelize";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class AlramHistoryService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  /** DELETE를 위한 SELECT */
  async findAllForRemoveAlramHistory() {
    try {
      return await this.seqeulize.query(
        `
        SELECT
          alram.oid
        FROM
          subscription_alram AS alram
        INNER
			JOIN berthStat_schedule AS berth ON berth.oid = alram.schedule_oid
        WHERE
          TRUE
          -- 출항일이 3일 지난 것만
            AND DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                MID(berth.tkoffPrarnde, 2, 16),
                LEFT(berth.tkoffPrarnde, 19)),
            '%Y-%m-%d %H:%i') IN (IF(DATE_ADD(DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                    MID(berth.tkoffPrarnde, 2, 16),
                    LEFT(berth.tkoffPrarnde, 19)),
                '%Y-%m-%d %H:%i'), INTERVAL 3 DAY) < DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i'),
            DATE_FORMAT(IF(LEFT(berth.tkoffPrarnde, 1) = '(',
                    MID(berth.tkoffPrarnde, 2, 16),
                    LEFT(berth.tkoffPrarnde, 19)),
                '%Y-%m-%d %H:%i'),
            NULL))
        `,
        {
          type: seqeulize.QueryTypes.SELECT,
          model: alramHistory,
          mapToModel: true,
        }
      );
    } catch (error) {
      Logger.error(error);
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
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(`${error} UPDATE Error!`);
    }
  }

  /** 알람 히스토리 삭제 function for schedule */
  async removeScheduleFuntion() {
    const t = await this.seqeulize.transaction();
    try {
      const historyRemoveOidList = await this.findAllForRemoveAlramHistory();

      if (historyRemoveOidList.length === 0) {
        await t.rollback();
        return;
      }

      for (const obj of historyRemoveOidList) {
        await alramHistory.destroy({
          where: { alramOid: obj.oid, isRead: 1 },
          transaction: t,
        });
      }

      await t.commit();
    } catch (error) {
      Logger.error(error);
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
      Logger.error(error);
      const GET_JOB = this.schedulerRegistry.getCronJob(
        "removeAlramHistorySchedule"
      );
      GET_JOB.stop();
    }
  }
}
