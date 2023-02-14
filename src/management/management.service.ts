import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { user } from "src/models";
import { Utils } from "src/util/common.utils";
import { CreateManagementDto } from "./dto/create-management.dto";
import { CreateTempCompanyUserDto } from "./dto/create-temp-company-user.dto";
import { UpdateManagementDto } from "./dto/update-management.dto";

@Injectable()
export class ManagementService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly util: Utils
  ) {}
  create(createManagementDto: CreateManagementDto) {
    return "This action adds a new management";
  }

  update(id: number, updateManagementDto: UpdateManagementDto) {
    return `This action updates a #${id} management`;
  }

  remove(id: number) {
    return `This action removes a #${id} management`;
  }

  /** 회사 관리자 등록 */
  async createTempCompanyManagement(
    createTempCompanyUserDto: CreateTempCompanyUserDto
  ) {
    const t = await this.seqeulize.transaction();
    try {
      const userOid = await this.util.getOid(user, "user");

      await user.create(
        { oid: userOid, ...createTempCompanyUserDto },
        { transaction: t }
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
