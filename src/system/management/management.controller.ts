import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
  Patch,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { ManagementService } from "./management.service";
import { ManagementRepository } from "./management.repository";
import { CreateCompanyManagementDto } from "./dto/create-management.dto";
import { UpdateUserStatusManagementDto } from "./dto/update-management-status.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UpdateManagementDto } from "./dto/update-management.dto";
import { OffsetPagingInfoDto } from "./dto/offset-paging-info.dto";
import { UpdateUserAuthDto } from "./dto/update-user-auth.dto";
import { UserStatus } from "./interface/auth.enums";

@UseGuards(JwtAuthGuard)
@Controller("management")
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
    private readonly managementRepository: ManagementRepository
  ) {}

  @Post("/")
  async createCompanyManagement(
    @Body()
    createCompanyManagementDto: CreateCompanyManagementDto
  ) {
    try {
      const responseData = await this.managementService.createCompanyManagement(
        createCompanyManagementDto
      );

      if (responseData === -1)
        return {
          message: "중복된 회사 코드입니다.",
          ok: false,
        };
      else if (responseData === 1)
        return { message: "회사 코드를 성공적으로 생성했습니다.", ok: true };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post("/page")
  findAllUserInfoForSuper(@Body() offsetPagingInfoDto: OffsetPagingInfoDto) {
    return this.managementService.makePageInfoForCompanyList(
      offsetPagingInfoDto
    );
  }

  @Get("/user")
  findOneUserInfoForSuper(@Param("oid") oid: string) {
    return this.managementRepository.findOneUserInfoForSuper(oid);
  }

  @Get("/company")
  findAllCompanyInfoForSuper(@Query("companyOid") companyOid: string) {
    return this.managementRepository.findAllCompanyInfoForSuper(companyOid);
  }

  @Get("/users")
  findAllUserListInfoForSuper(@Query("companyOid") companyOid: string) {
    return this.managementRepository.findAllUserListInfoForSuper(companyOid);
  }

  @Patch("/company")
  async updateStmCompanyManagement(
    @Body() updateCompanyManagementDto: UpdateManagementDto
  ) {
    try {
      const responseData =
        await this.managementService.updateStmCompanyManagement(
          updateCompanyManagementDto
        );
      if (responseData === 1)
        return {
          message: "회사관리자 계정을 성공적으로 업데이트 했습니다.",
          ok: true,
        };
    } catch (error) {
      Logger.error(error);
      return {
        message: "회사관리자 계정을 업데이트 하는 데 실패했습니다.",
        ok: false,
        error: new InternalServerErrorException(error),
      };
    }
  }

  @Put("/status")
  async updateUserStatus(
    @Body()
    updateUserStatusManagementDto: UpdateUserStatusManagementDto
  ) {
    try {
      const responseData = await this.managementService.updateUserStatus(
        updateUserStatusManagementDto
      );

      if (responseData === UserStatus.USE)
        return { message: "사용 상태로 업데이트 되었습니다.", ok: true };
      else if (responseData === UserStatus.CLOSE)
        return { message: "사용 중지 상태로 업데이트 되었습니다.", ok: true };
    } catch (error) {
      Logger.error(error);
      return {
        message: "업데이트 중 에러",
        ok: false,
        error: new InternalServerErrorException(error),
      };
    }
  }

  @Patch("/auth")
  async updateUserAuth(
    @Body()
    updateData: UpdateUserAuthDto
  ) {
    try {
      const responseData = await this.managementService.updateUserAuth(
        updateData
      );

      if (responseData === -1)
        return {
          message: `업데이트 실패`,
          ok: false,
        };
      else if (responseData)
        return {
          message: `권한이 ${responseData}으로 업데이트 되었습니다.`,
          ok: true,
        };
    } catch (error) {
      Logger.error(error);
      return {
        message: `업데이트 실패`,
        ok: false,
        error: new InternalServerErrorException(error),
      };
    }
  }
}
