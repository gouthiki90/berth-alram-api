import { Injectable, Logger } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import seqelize from "sequelize";
import { Utils } from "src/util/common.utils";

@Injectable()
export class ManageMentRepository {
  constructor(
    private readonly util: Utils,
    private readonly seqelize: Sequelize
  ) {}

  /** 슈퍼 관리자 대쉬보드 SELECT */
  async findAllUserFromSuperDashBoard() {
    try {
      return await this.seqelize.query(
        `
        SELECT
          oid, -- 유저 키값
          company_code, -- 회사 코드
          represent, -- 회사 대표명
          user_id, -- 유저 아이디
          contact, -- 연락처
          contact_01, -- 연락처2
          email, -- 이메일
          auth_status -- 가입상태
        FROM user
        `,
        { type: seqelize.QueryTypes.SELECT }
      );
    } catch (error) {
      Logger.error(`${error}`);
    }
  }

  /** 회사 관리자 유저 SELECT */
  async findAllUserFromCompanyDashBoard() {
    try {
      return await this.seqelize.query(
        `
        SELECT
          oid, -- 유저 키값
          company_code, -- 회사 코드
          user_id, -- 유저 아이디
          password, -- 비밀번호
          manager_name, -- 담당자 이름
          manager_tel, -- 담당자 번호
          email -- 이메일
        FROM user
        GROUP BY
            company_code
        `,
        { type: seqelize.QueryTypes.SELECT }
      );
    } catch (error) {
      Logger.error(`${error}`);
    }
  }
}
