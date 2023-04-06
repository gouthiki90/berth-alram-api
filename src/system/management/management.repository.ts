import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import seqeulize from "sequelize";

@Injectable()
export class ManagementRepository {
  constructor(private readonly seqeulize: Sequelize) {}

  /** 관리자 페이지 대쉬보드 SELECT */
  async findAllUserInfoForSuper(offset: number) {
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
        LIMIT $offset, 20
        `,
        { type: seqeulize.QueryTypes.SELECT, bind: { offset: offset } }
      );
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(error);
    }
  }

  /** 관리자 페이지 대쉬보드 SELECT */
  async findAllUserInfoForSuperAll() {
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

  /** 회사 코드에 따른 유저 리스트 SELECT */
  async findAllUserListInfoForSuper(companyOid: string) {
    try {
      return await this.seqeulize.query(
        `
          SELECT
            com.oid AS companyOid,
            usr.oid,
            usr.user_id,
            usr.userName,
            usr.manager_name,
            usr.manager_tel,
            (SELECT code_name FROM common_code WHERE usr.role = oid) AS role, -- 가입상태
            (SELECT code_name FROM common_code WHERE usr.status = oid) AS status, -- 가입상태
            (SELECT code_name FROM common_code WHERE usr.auth_status = oid) AS authStatus -- 가입상태
          FROM user AS usr
          INNER JOIN stm_company AS com ON usr.stm_company_oid = com.oid -- 업체
          WHERE TRUE
          AND com.oid = $companyOid
          `,
        { type: seqeulize.QueryTypes.SELECT, bind: { companyOid } }
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
