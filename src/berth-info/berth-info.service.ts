import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class BerthInfoService {
  constructor(private readonly seqeulize: Sequelize) {}
}
