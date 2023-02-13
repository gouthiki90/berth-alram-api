import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { Utils } from "src/util/common.utils";
import { CreateManagementDto } from "./dto/create-management.dto";
import { ManagementCompanyInfoDto } from "./dto/management-compay-info.dto";
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

  /** 관리자 페이지에서 회사 등록/수정 */
  async upsertCompanyInfo(manageCompanyInfoDto: ManagementCompanyInfoDto) {
    try {
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
