import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseFilters,
  UseGuards,
  Put,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ErrorHandler } from "src/error-handler/error-handler";
import { ContainersReposiotry } from "./containers.repository";
import { ContainersService } from "./containers.service";
import { CreateContainerDto } from "./dto/create-container.dto";
import { DeleteContainerDto } from "./dto/delete-container.dto";
import { DynamicUpdateContainerDangerStatusDto } from "./dto/dynamic-update-container-danger-status.dto";
import { DynamicUpdateContainerStatus } from "./dto/dynamic-update-container-status.dto";

@UseGuards(JwtAuthGuard)
@UseFilters(ErrorHandler)
@Controller("containers")
export class ContainersController {
  constructor(
    private readonly containersService: ContainersService,
    private readonly containersRepository: ContainersReposiotry
  ) {}

  @Get("/")
  getConListModal(@Query() query: any) {
    return this.containersRepository.findOne(query);
  }

  @Post("/new-list")
  getContainerListFormEtrans(
    @Body() containerListDto: Array<CreateContainerDto>
  ) {
    return this.containersService.createContainers(containerListDto);
  }

  @Post("/")
  deleteContainers(@Body() data: DeleteContainerDto) {
    return this.containersService.deleteContainers(data);
  }

  @Put("/container-status")
  changeContainerStatus(@Body() data: DynamicUpdateContainerStatus) {
    return this.containersService.dynamicUpdateContainerStatus(data);
  }

  @Put("/container-danger-status")
  changeContainerIsDangerStatus(
    @Body() data: DynamicUpdateContainerDangerStatusDto
  ) {
    return this.containersService.dynamicUpdateContainerIsDangerStatus(data);
  }
}
