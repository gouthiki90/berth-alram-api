import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { user } from "src/models";

@Injectable()
export class UserRepository {
  constructor(private readonly seqeulize: Sequelize) {}
  async findAll() {
    try {
      return await user.findAll();
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(oid: string) {
    try {
      return await user.findOne({ where: { oid: oid } });
    } catch (error) {
      console.log(error);
    }
  }

  async getUserInfo(userId: string) {
    try {
      return await user.findOne({ where: { userId: userId } });
    } catch (error) {
      console.log(error);
    }
  }
}
