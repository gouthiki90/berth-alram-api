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
      /** 로그인 check */
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
        return {
          message: "로그인 정보를 찾을 수 없습니다.",
          ok: false,
          error: new UnauthorizedException(),
        };
      }

      /** 로그인 시 토큰 발급 */
      const userTokenInfo = this.authService.login({
        oid: userData.oid,
        userId: userData.userId,
        role: userData.role,
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
      /** 아이디 중복 check */
      const userData = await user.findOne({
        where: {
          userId: createUserDto.userId,
        },
      });

      if (userData?.userId) {
        return { message: "중복된 아이디 입니다.", ok: false };
      }

      createUserDto.password = crypto
        .createHash("sha512")
        .update(createUserDto.password)
        .digest("hex");

      const USER_OID = await this.util.getOid(user, "User");
      createUserDto.oid = USER_OID;

      await user.create(createUserDto, { transaction: t });

      await t.commit();

      return { message: "성공적으로 계정이 생성되었습니다.", ok: true };
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      return {
        message: "계정 생성에 실패했습니다.",
        ok: false,
        error: new InternalServerErrorException(error),
      };
    }
  }

  /** 유저 정보 업데이트 */
  async update(oid: string, updateUserDto: UpdateUserDto) {
    const t = await this.seqeulize.transaction();
    try {
      /** 아이디 중복 check */
      if (updateUserDto.userId) {
        const userData = await user.findOne({
          where: {
            userId: updateUserDto.userId,
          },
        });

        if (userData?.userId) {
          return { message: "중복된 아이디 입니다.", ok: false };
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
      return { result, message: "성공적으로 탈퇴되었습니다.", ok: true };
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException("탈퇴 실패");
    }
  }
}
