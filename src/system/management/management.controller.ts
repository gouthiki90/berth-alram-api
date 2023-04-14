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
} from "@nestjs/common";
import { ManagementService } from "./management.service";
import { ManagementRepository } from "./management.repository";
import { CreateCompanyManagementDto } from "./dto/create-management.dto";
import { UpdateUserStatusManagementDto } from "./dto/update-management-status.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UpdateManagementDto } from "./dto/update-management.dto";
import { OffsetPagingInfoDto } from "./dto/offset-paging-info.dto";
import { UpdateUserAuthDto } from "./dto/update-user-auth.dto";

@UseGuards(JwtAuthGuard)
@Controller("management")
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
    private readonly managementRepository: ManagementRepository
  ) {}

  @Post("/")
  createCompanyManagement(
    @Body()
    createCompanyManagementDto: CreateCompanyManagementDto
  ) {
    return this.managementService.createCompanyManagement(
      createCompanyManagementDto
    );
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
  updateStmCompanyManagement(
    @Body() updateCompanyManagementDto: UpdateManagementDto
  ) {
    return this.managementService.updateStmCompanyManagem3ent(
      updateCompanyManagementDto
    );
  }

  @Put("/status")
  updateUserStatus(
    @Body()
    updateUserStatusManagementDto: UpdateUserStatusManagementDto
  ) {
    return this.managementService.updateUserStatus(
      updateUserStatusManagementDto
    );
  }

  @Patch("/auth")
  updateUserAuth(
    @Body()
    updateData: UpdateUserAuthDto
  ) {
    return this.managementService.updateUserAuth(updateData);
  }
}
