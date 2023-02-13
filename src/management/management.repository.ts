import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import sequelize from "sequelize";
import { Utils } from "src/util/common.utils";

@Injectable()
export class ManagementRepository {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly util: Utils
  ) {}

  /** 슈퍼 관리자 페이지 대쉬보드 */
  async findAllUserInfoListForSuperUser() {
    try {
      return await this.seqeulize.query(
        `
        SELECT
            oid, -- 유저 키값
            company_group_code, -- 회사 그룹 코드
            principal, -- 대표자 이름
            user_id, -- 유저 아이디
            manager_tel, -- 담당자 연락처
            email, -- 이메일
            (SELECT code_name FROM common_code WHERE oid = usr.status) AS status -- 계정 사용 상태
        FROM user AS usr
        `,
        { type: sequelize.QueryTypes.SELECT }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }

  /** 사용자 정보 모달 */
  async findOneUserInfoForSuperUser(query: any) {
    const { oid, companyGroupCode } = query;

    const whereArr = [
      ["AND oid = :oid", oid],
      ["AND company_group_code = :companyGroupCode", companyGroupCode],
    ];
    try {
      return await this.seqeulize.query(
        `
        SELECT
            oid, -- 유저 키값
            company_group_code, -- 회사 그룹 코드
            principal, -- 대표자 이름
            user_id, -- 유저 아이디
            manager_tel, -- 담당자 연락처
            email, -- 이메일
            (SELECT code_name FROM common_code WHERE oid = usr.status) AS status -- 계정 사용 상태
        FROM user AS usr
        WHERE TRUE
        ${this.util.generator(whereArr, query)}
        `,
        { type: sequelize.QueryTypes.SELECT, replacements: query }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }
}
