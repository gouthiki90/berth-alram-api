import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { user } from "src/models";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as crypto from "crypto";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "src/auth/auth.service";
import { Utils } from "src/util/common.utils";

@Injectable()
export class UserService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly authService: AuthService,
    private readonly util: Utils
  ) {}

  /** 로그인 */
  async login(loginData: LoginDto) {
    try {
      // duple check
      const userData = await user.findOne({
        where: {
          userId: loginData.userId,
          password: crypto
            .createHash("sha512")
            .update(loginData.password)
            .digest("hex"),
        },
      });

      if (!userData) {
        throw new UnauthorizedException("로그인 정보를 찾을 수 없습니다.");
      }

      const userTokenInfo = this.authService.login({
        oid: userData.oid,
        userId: userData.userId,
        bizName: userData.bizName,
      });

      return userTokenInfo;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 유저 생성 */
  async create(createUserDto: CreateUserDto) {
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

      createUserDto.password = crypto
        .createHash("sha512")
        .update(createUserDto.password)
        .digest("hex");

      const USER_OID = await this.util.getOid(user, "User");
      createUserDto.oid = USER_OID;

      await user.create(createUserDto, { transaction: t });

      await t.commit();
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }

  /** 유저 정보 업데이트 */
  async update(oid: string, updateUserDto: UpdateUserDto) {
    const t = await this.seqeulize.transaction();
    Logger.debug(updateUserDto);
    try {
      // duple check
      if (updateUserDto.userId) {
        const userData = await user.findOne({
          where: {
            userId: updateUserDto.userId,
          },
        });

        if (userData?.userId) {
          return { message: "중복된 아이디 입니다." };
        }
      }

      await user.update(updateUserDto, {
        where: { oid: oid },
        transaction: t,
      });

      await t.commit();
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }

  /** 유저 탈퇴 */
  async remove(oid: string) {
    const t = await this.seqeulize.transaction();
    try {
      await user.destroy({ where: { oid: oid }, transaction: t });
      const result = await t.commit();
      return { result, message: "성공적으로 탈퇴되었습니다.", code: 1 };
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException("탈퇴 실패");
    }
  }
}
