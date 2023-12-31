import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { stmCompany, user } from "src/models";
import { Utils } from "src/util/common.utils";
import { CreateCompanyManagementDto } from "./dto/create-management.dto";
import { UserStatus, AuthCode } from "./interface/auth.enums";
import { UpdateUserStatusManagementDto } from "./dto/update-management-status.dto";
import { UpdateManagementDto } from "./dto/update-management.dto";
import { OffsetPagingInfoDto } from "./dto/offset-paging-info.dto";
import { ManagementRepository } from "./management.repository";
import { ForPagingCompanyDto } from "./dto/for-paging-company.dto";
import { OffsetPagenatedBerthStateDataDto } from "./dto/offset-pagenated-berth-state-data.dto";
import { UpdateUserAuthDto } from "./dto/update-user-auth.dto";

@Injectable()
export class ManagementService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly managementRepository: ManagementRepository,
    private readonly offsetPagenatedBerthStateDataDto: OffsetPagenatedBerthStateDataDto,
    private readonly util: Utils
  ) {}

  /** 사업자 번호 중복체크 */
  async checkingCompanyDupleCode(code: string) {
    try {
      return await stmCompany.findAll({ where: { code: code } });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async makePageInfoForCompanyList(data: OffsetPagingInfoDto) {
    /** 페이징 카운트의 디폴트값 */
    const PAGE_ITEM_COUNT = 20;
    /** OFFSET 계산 */
    const OFFSET = PAGE_ITEM_COUNT * data.pageIndex;
    /** 매번 새로운 객체의 선석 데이터 */
    const BERTH_PAGING_ITEMS = new Array<ForPagingCompanyDto>();

    try {
      if ("number" !== typeof data.pageIndex) {
        throw new NotFoundException("Is not number or this value is undefined");
      }

      if (typeof null === typeof data.pageIndex) {
        throw new NotFoundException("Is null");
      }

      /** 페이징을 위한 SELECT */
      const allCompanyUserForSuperList =
        await this.managementRepository.findAllUserInfoForSuperAll();

      /** 페이징 계산을 위한 SELECT */
      const companyListForPage =
        await this.managementRepository.findAllUserInfoForSuper(OFFSET);

      if (allCompanyUserForSuperList.length !== 0) {
        data.pageItemCount = PAGE_ITEM_COUNT;
        data.totalDocumentCount = allCompanyUserForSuperList.length;
        data.totalPageCount = Math.ceil(allCompanyUserForSuperList.length / 20);
        data.currentItemCount = companyListForPage.length;

        /** 페이징 계산 데이터 */
        const PAGE_INFO = { ...data };

        companyListForPage.map((value: ForPagingCompanyDto) => {
          BERTH_PAGING_ITEMS.push(value);
        });

        this.offsetPagenatedBerthStateDataDto.items = BERTH_PAGING_ITEMS;
        this.offsetPagenatedBerthStateDataDto.pageInfo = PAGE_INFO;

        return this.offsetPagenatedBerthStateDataDto;
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  /** 업체 create */
  async createCompanyManagement(createCompanyDto: CreateCompanyManagementDto) {
    const t = await this.seqeulize.transaction();
    try {
      const companyIsDupleData = await this.checkingCompanyDupleCode(
        createCompanyDto.oid
      );

      if (companyIsDupleData.length !== 0) {
        return -1;
      }

      await stmCompany.create(createCompanyDto, { transaction: t });
      await t.commit();
      return 1;
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }

  /** 업체 업데이트 */
  async updateStmCompanyManagement(
    updateCompanyManagementDto: UpdateManagementDto
  ) {
    const t = await this.seqeulize.transaction();
    try {
      await stmCompany.update(updateCompanyManagementDto, {
        where: { oid: updateCompanyManagementDto.oid },
        transaction: t,
      });
      await t.commit();
      return 1;
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }

  /** 유저 계정 사용/사용 중지 update */
  async updateUserStatus(
    updateUserStatusManagementDto: UpdateUserStatusManagementDto
  ) {
    const { code } = updateUserStatusManagementDto;

    if (code === 1) updateUserStatusManagementDto.status = UserStatus.USE;
    else updateUserStatusManagementDto.status = UserStatus.CLOSE;

    const t = await this.seqeulize.transaction();

    try {
      await user.update(updateUserStatusManagementDto, {
        where: { oid: updateUserStatusManagementDto.oid },
        transaction: t,
      });

      await t.commit();

      if (code === 1) return UserStatus.USE;
      else return UserStatus.CLOSE;
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }

  /** 유저 권한 업데이트 */
  async updateUserAuth(updateData: UpdateUserAuthDto) {
    const t = await this.seqeulize.transaction();

    /** authCode 이름 */
    let authCodeName: string;
    switch (updateData.role) {
      case AuthCode.SUPER:
        authCodeName = "슈퍼계정";
        break;
      case AuthCode.EMPLOYEE:
        authCodeName = "직원";
        break;
      case AuthCode.MANAGEMENT:
        authCodeName = "관리자";
        break;
      default:
        break;
    }

    try {
      await user.update(
        { role: updateData.role },
        { where: { oid: updateData.oid }, transaction: t }
      );
      await t.commit();

      if (!authCodeName) {
        return -1;
      }

      return authCodeName;
    } catch (error) {
      Logger.error(error);
      await t.rollback();
      throw new InternalServerErrorException(error);
    }
  }
}
