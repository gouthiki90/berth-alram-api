import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ManagementService } from "./management.service";
import { ManagementRepository } from "./management.repository";
import { CreateCompanyManagementDto } from "./dto/create-management.dto";
import { UpdateUserStatusManagementDto } from "./dto/update-management.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("management")
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
    private readonly managementRepository: ManagementRepository
  ) {}

  @Post("/")
  createCompanyManagementUser(
    createCompanyManagementDto: CreateCompanyManagementDto
  ) {
    return this.managementService.createCompanyManagementUser(
      createCompanyManagementDto
    );
  }

  @Get("/")
  findAllUserInfoForSuper() {
    return this.managementRepository.findAllUserInfoForSuper();
  }

  @Get("/user")
  findOneUserInfoForSuper(@Param("oid") oid: string) {
    return this.managementRepository.findOneUserInfoForSuper(oid);
  }

  @Get("/company")
  findAllCompanyInfoForSuper(@Query() companyOid: string) {
    return this.managementRepository.findAllCompanyInfoForSuper(companyOid);
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
}
