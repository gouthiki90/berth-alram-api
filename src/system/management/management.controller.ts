import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ManagementService } from "./management.service";
import { CreateManagementDto } from "./dto/create-management.dto";
import { UpdateManagementDto } from "./dto/update-management.dto";
import { ManagementRepository } from "./management.repository";

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

  @Get("/")
  findAllUserInfoForSuper() {
    return this.managementRepository.findAllUserInfoForSuper();
  }

  @Get("/user")
  findOneUserInfoForSuper(@Param("oid") oid: string) {
    return this.managementRepository.findOneUserInfoForSuper(oid);
  }

  @Get("/company")
  findAllCompanyInfoForSuper() {
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
