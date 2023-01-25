import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { user } from "src/models";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as crypto from "crypto";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "src/auth/auth.service";
import { Utils } from "src/util/common.utils";
import { Response } from "express";
import { ErrorHandler } from "src/error-handler/error-handler";
import { UpdateIsNotificationDto } from "./dto/update-is-notification.dto";

@UseFilters(ErrorHandler)
@Injectable()
export class UserService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly authService: AuthService,
    private readonly util: Utils
  ) {}

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
        throw new NotFoundException("유저 정보를 찾을 수 없습니다.");
      }

      const userTokenInfo = this.authService.login({
        oid: userData.oid,
        userId: userData.userId,
        bizName: userData.bizName,
      });

      return userTokenInfo;
    } catch (error) {
      console.log(error);
    }
  }

  async create(createUserDto: CreateUserDto, res: Response) {
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
        res.status(409).json({
          statusCode: 409,
          message: "중복된 아이디 입니다.",
          path: "/user",
        });

        throw new Error("중복된 아이디 입니다.");
      }

      createUserDto.password = crypto
        .createHash("sha512")
        .update(createUserDto.password)
        .digest("hex");

      const USER_OID = await this.util.getOid(user, "User");
      createUserDto.oid = USER_OID;

      await user.create(createUserDto, { transaction: t });

      const result = await t.commit();
      res.send({ result });
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  async update(oid: string, updateUserDto: UpdateUserDto, res: Response) {
    const t = await this.seqeulize.transaction();
    try {
      // duple check
      if (updateUserDto.userId) {
        const userData = await user.findOne({
          where: {
            userId: updateUserDto.userId,
          },
        });

        if (userData?.userId) {
          res.status(409).json({
            statusCode: 409,
            message: "중복된 아이디 입니다.",
            path: "/user/:oid",
          });

          throw new Error("중복된 아이디 입니다.");
        }
      }

      await user.update(updateUserDto, {
        where: { oid: oid },
        transaction: t,
      });

      const result = await t.commit();
      res.send({ result });
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  async remove(oid: string) {
    const t = await this.seqeulize.transaction();
    try {
      await user.destroy({ where: { oid: oid }, transaction: t });
      const result = await t.commit();
      return { result, message: "성공적으로 탈퇴되었습니다.", code: 1 };
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw new InternalServerErrorException("탈퇴 실패");
    }
  }

  async updateIsNotification(isNotificationDto: UpdateIsNotificationDto) {
    const t = await this.seqeulize.transaction();
    try {
      await user.update(
        { isNofitication: isNotificationDto.isNotification },
        { where: { oid: isNotificationDto.oid }, transaction: t }
      );

      const result = await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw new InternalServerErrorException("수정 실패");
    }
  }
}
