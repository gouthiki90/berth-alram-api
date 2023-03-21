import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { stmCompany, user } from "src/models";
import { Utils } from "src/util/common.utils";
import { CreateCompanyManagementDto } from "./dto/create-management.dto";
import { UserStatus } from "./interface/auth.enums";
import { UpdateUserStatusManagementDto } from "./dto/update-management-status.dto";
import { UpdateManagementDto } from "./dto/update-management.dto";

@Injectable()
export class ManagementService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly util: Utils
  ) {}

  /** 사업자 번호 중복체크 */
  async checkingCompanyDupleCode(code: string) {
    try {
      return await stmCompany.findAll({ where: { code: code } });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 업체 create */
  async createCompanyManagement(createCompanyDto: CreateCompanyManagementDto) {
    const t = await this.seqeulize.transaction();
    try {
      const companyIsDupleData = await this.checkingCompanyDupleCode(
        createCompanyDto.code
      );

      if (companyIsDupleData.length === 0) {
        return { message: "중복된 회사 코드입니다." };
      }

      await stmCompany.create(createCompanyDto, { transaction: t });
      await t.commit();
      return { message: "회사관리자 계정을 성공적으로 생성했습니다." };
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }

  /** 업체 업데이트 */
  async updateStmCompanyManagem3ent(
    updateCompanyManagementDto: UpdateManagementDto
  ) {
    const t = await this.seqeulize.transaction();
    try {
      const companyIsDupleData = await this.checkingCompanyDupleCode(
        updateCompanyManagementDto.code
      );

      if (companyIsDupleData.length === 0) {
        return { message: "중복된 회사 코드입니다." };
      }

      await stmCompany.create(updateCompanyManagementDto, { transaction: t });
      await t.commit();
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }

  /** 유저 계정 사용/사용 중지 update */
  async updateUserStatus(
    updateUserStatusManagementDto: UpdateUserStatusManagementDto
  ) {
    const { code } = updateUserStatusManagementDto;

    if (code === 1) updateUserStatusManagementDto.status = UserStatus.USE;
    else updateUserStatusManagementDto.status = UserStatus.CLOSE;

    const t = await this.seqeulize.transaction();

    try {
      await user.update(updateUserStatusManagementDto, {
        where: { oid: updateUserStatusManagementDto.oid },
        transaction: t,
      });

      await t.commit();

      if (code === 1) return { message: "사용 상태로 업데이트 되었습니다." };
      else return { message: "사용 중지 상태로 업데이트 되었습니다." };
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }
}
