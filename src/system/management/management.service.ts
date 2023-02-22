import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { user } from "src/models";
import { Utils } from "src/util/common.utils";
import { CreateCompanyManagementDto } from "./dto/create-management.dto";
import { UpdateManagementDto } from "./dto/update-management.dto";
import * as crypto from "crypto";
import { AuthCode, UserStatus } from "./interface/auth.enums";

@Injectable()
export class ManagementService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly util: Utils
  ) {}
  /** 회사 관리자 유저 create */
  async createCompanyManagementUser(createUserDto: CreateCompanyManagementDto) {
    const t = await this.seqeulize.transaction();
    try {
      // duple check
      const userData = await user.findOne({
        where: {
          userId: createUserDto.userId,
          password: crypto
            .createHash("sha512")
            .update(createUserDto.password)
            .digest("hex"),
        },
      });

      if (userData?.userId) {
        return { message: "중복된 아이디 입니다." };
      }

      /** 유저 키값 생성 */
      const USER_OID = await this.util.getOid(user, "User");
      createUserDto.oid = USER_OID;

      /** password encoding */
      createUserDto.password = crypto
        .createHash("sha512")
        .update(createUserDto.password)
        .digest("hex");

      /** 사용 상태, 권한 코드 입력 */
      createUserDto.authCode = AuthCode.MANAGEMENT;
      createUserDto.status = UserStatus.USE;

      await user.create(createUserDto, { transaction: t });
      await t.commit();
      return { message: "회사관리자 계정을 성공적으로 생성했습니다." };
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }
  update(id: number, updateManagementDto: UpdateManagementDto) {
    return `This action updates a #${id} management`;
  }

  remove(id: number) {
    return `This action removes a #${id} management`;
  }
}
