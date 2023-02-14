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
import * as crypto from "crypto";

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
      /** userId 중복 체크 */
      const userData = await user.findOne({
        where: {
          userId: createTempCompanyUserDto.userId,
          password: crypto
            .createHash("sha512")
            .update(createTempCompanyUserDto.password)
            .digest("hex"),
        },
      });

      if (userData?.userId) {
        return { message: "중복된 아이디 입니다." };
      }

      /** oid 생성 */
      const userOid = await this.util.getOid(user, "user");

      /** password 암호화 */
      createTempCompanyUserDto.password = crypto
        .createHash("sha512")
        .update(createTempCompanyUserDto.password)
        .digest("hex");

      await user.create(
        { oid: userOid, ...createTempCompanyUserDto },
        { transaction: t }
      );

      await t.commit();

      return { message: "성공적으로 계정이 생성되었습니다." };
    } catch (error) {
      await t.rollback();
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
