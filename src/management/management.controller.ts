import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ManagementService } from "./management.service";
import { CreateManagementDto } from "./dto/create-management.dto";
import { UpdateManagementDto } from "./dto/update-management.dto";
import { ManagementRepository } from "./management.repository";
import { ManagementFindOneQueryDto } from "./dto/management-find-one-query.dto";
import { CreateTempCompanyUserDto } from "./dto/create-temp-company-user.dto";

@Controller("management")
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
    private readonly managementRepository: ManagementRepository
  ) {}

  @Post()
  create(@Body() createManagementDto: CreateManagementDto) {
    return this.managementService.create(createManagementDto);
  }

  @Post("/company-info")
  upsertCompanyInfo(
    @Body() createTempCompanyUserDto: CreateTempCompanyUserDto
  ) {
    return this.managementService.createTempCompanyManagement(
      createTempCompanyUserDto
    );
  }

  @Get("/")
  findAll() {
    return this.managementRepository.findAllUserInfoListForSuperUser();
  }

  @Get("/user")
  findOne(@Query() query: ManagementFindOneQueryDto) {
    return this.managementRepository.findOneUserInfoForSuperUser(query);
  }

  @Get("/company")
  findOneOfCompany() {
    return this.managementRepository.findAllCompanyInfoForSuper();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateManagementDto: UpdateManagementDto
  ) {
    return this.managementService.update(+id, updateManagementDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.managementService.remove(+id);
  }
}
