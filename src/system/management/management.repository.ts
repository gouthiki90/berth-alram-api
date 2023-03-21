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
          oid,
          code, -- 회사 그룹 코드
          biz_name,
          principal, -- 회사 대표자
          tel, -- 전화번호
          email, -- 이메일
          limit_user
        FROM stm_company
        `,
        { type: seqeulize.QueryTypes.SELECT }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }

  /** 사용자정보 모달 SELECT */
  async findOneUserInfoForSuper(companyOid: string) {
    try {
      return await this.seqeulize.query(
        `
        SELECT
          usr.oid AS userOid,
          usr.user_id,
          com.oid AS companyOid,
          com.code, -- 회사 그룹 코드
          com.biz_name,
          com.principal, -- 회사 대표자
          com.tel, -- 전화번호
          com.email, -- 이메일
          com.limit_user
          (SELECT code_name FROM common_code WHERE usr.status = oid) AS status -- 가입상태
        FROM user AS usr
        INNER JOIN stm_company AS com ON usr.stm_company_oid = com.oid -- 업체
        WHERE TRUE
        AND com.oid = $oid
        `,
        { type: seqeulize.QueryTypes.SELECT, bind: { oid: companyOid } }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }

  /** 업체&업체코드 수정 또는 추가 모달 */
  async findAllCompanyInfoForSuper(companyOid: string) {
    try {
      return await this.seqeulize.query(
        `
        SELECT
          oid,
          code, -- 회사 그룹 코드
          biz_name,
          principal, -- 회사 대표자
          tel, -- 전화번호
          email, -- 이메일
          limit_user
        FROM stm_company
        WHERE TRUE
        AND oid = $oid
        `,
        { type: seqeulize.QueryTypes.SELECT, bind: { oid: companyOid } }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }
}
