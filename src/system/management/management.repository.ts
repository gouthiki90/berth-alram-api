import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import seqeulize from "sequelize";

@Injectable()
export class ManagementRepository {
  constructor(private readonly seqeulize: Sequelize) {}

  /** 관리자 페이지 대쉬보드 SELECT */
  async findAllUserInfoForSuper() {
    try {
      return await this.seqeulize.query(
        `
        SELECT
            company_group_code, -- 회사 그룹 코드
            principal, -- 회사 대표자
            user_id, -- 유저 아이디
            contact, -- 전화번호
            email, -- 이메일
            (SELECT code_name FROM common_code WHERE usr.status = oid) AS status -- 가입상태
        FROM user AS usr
        `,
        { type: seqeulize.QueryTypes.SELECT }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }

  /** 사용자정보 모달 SELECT */
  async findOneUserInfoForSuper(oid: string) {
    try {
      return await this.seqeulize.query(
        `
        SELECT
            company_group_code, -- 회사 그룹 코드
            principal, -- 회사 대표자
            user_id, -- 유저 아이디
            contact, -- 전화번호
            email, -- 이메일
            (SELECT code_name FROM common_code WHERE usr.status = oid) AS status -- 가입상태
        FROM user AS usr
        WHERE TRUE
        AND usr.oid = $oid
        `,
        { type: seqeulize.QueryTypes.SELECT, bind: { oid: oid } }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }

  /** 업체&업체코드 수정 또는 추가 모달 */
  async findAllCompanyInfoForSuper() {
    try {
      return await this.seqeulize.query(
        `
        SELECT
            company_group_code, -- 회사 그룹 코드
            principal, -- 회사 대표자
            user_id, -- 유저 아이디
            password, -- 패스워드
            bizName -- 상호
        FROM user AS usr
        `,
        { type: seqeulize.QueryTypes.SELECT }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }
}
