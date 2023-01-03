import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { alramHistory } from "src/models";
import { UpdateAlramHistoryDto } from "./dto/update-alram-history.dto";

@Injectable()
export class AlramHistoryService {
  constructor(private readonly seqeulize: Sequelize) {}
  async update(dto: UpdateAlramHistoryDto) {
    const t = await this.seqeulize.transaction();
    try {
      await alramHistory.update(
        { isRead: dto.isRead },
        { where: { oid: dto.historyOid }, transaction: t }
      );

      const result = await t.commit();
      return result;
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw new InternalServerErrorException(`${error} UPDATE Error!`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} alramHistory`;
  }
}
