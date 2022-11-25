import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { user } from "src/models";
import { UserRepository } from "./user.repository";
import { Utils } from "src/util/common.utils";
import { AuthService } from "src/auth/auth.service";

@Module({
  imports: [SequelizeModule.forFeature([user])],
  controllers: [UserController],
  providers: [UserService, UserRepository, Utils, AuthService],
})
export class UserModule {}
