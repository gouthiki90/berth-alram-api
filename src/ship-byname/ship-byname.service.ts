import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { shipByname } from "src/models";
import { Utils } from "src/util/common.utils";
import { CreateShipBynameDto } from "./dto/create-ship-byname.dto";
import { UpdateShipBynameDto } from "./dto/update-ship-byname.dto";

@Injectable()
export class ShipBynameService {
  constructor(
    private readonly seqelize: Sequelize,
    private readonly util: Utils
  ) {}

  /** 모선명에 대한 별칭 생성 */
  async create(createShipBynameDto: CreateShipBynameDto) {
    const t = await this.seqelize.transaction();
    try {
      /** oid 생성 */
      const OID = await this.util.getOid(shipByname, "shipByname");
      createShipBynameDto.oid = OID;

      await shipByname.create(createShipBynameDto, { transaction: t });
      await t.commit();
    } catch (error) {
      await t.rollback();
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 모선명 별칭 업데이트 */
  async update(updateShipBynameDto: UpdateShipBynameDto) {
    const t = await this.seqelize.transaction();
    try {
      await shipByname.update(updateShipBynameDto, {
        where: { oid: updateShipBynameDto.oid },
        transaction: t,
      });
      await t.commit();
    } catch (error) {
      await t.rollback();
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 모선 별칭 삭제 */
  async remove(oid: string) {
    const t = await this.seqelize.transaction();
    try {
      await shipByname.destroy({ where: { oid: oid }, transaction: t });
      await t.commit();
    } catch (error) {
      await t.rollback();
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
