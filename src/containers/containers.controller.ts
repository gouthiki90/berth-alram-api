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
import { DeleteContainerDto } from "./dto/delete-container.dto";
import { DynamicUpdateContainerStatus } from "./dto/dynamic-update-container-status.dto";
import { PostContainerListResponseDto } from "./dto/post-container-list-response.dto";
import { PostContainerListDto } from "./dto/post-container-list.dto";

// @UseGuards(JwtAuthGuard)
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
  getContainerListFormEtrans(@Body() containerListDto: PostContainerListDto) {
    return this.containersService.createContainerList(containerListDto);
  }

  @Post("/confirm-list-py")
  postConCodeToPython(@Body() upsertContainer: PostContainerListResponseDto) {
    return this.containersService.sendConInfoToPython(upsertContainer);
  }

  @Post("/")
  deleteContainers(@Body() data: DeleteContainerDto) {
    return this.containersService.deleteContainers(data);
  }

  @Put("/container-status")
  changeContainerStatus(@Body() data: DynamicUpdateContainerStatus) {
    return this.containersService.dynamicUpdateContainerStatus(data);
  }
}
