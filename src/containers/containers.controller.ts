import { Controller, Post, Body, Delete, Get, Query } from "@nestjs/common";
import { ContainersReposiotry } from "./containers.repository";
import { ContainersService } from "./containers.service";
import { PostContainerListResponseDto } from "./dto/post-container-list-response.dto";
import { PostContainerListDto } from "./dto/post-container-list.dto";

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

  @Delete("/")
  deleteContainers(@Body() oid: Array<string>) {
    return this.containersService.deleteContainers(oid);
  }
}
