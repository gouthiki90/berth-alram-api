import { Controller, Post, Body, Put, Delete, Param } from "@nestjs/common";
import { ContainersService } from "./containers.service";
import { PostContainerListResponseDto } from "./dto/post-container-list-response.dto";
import { PostContainerListDto } from "./dto/post-container-list.dto";

@Controller("containers")
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post("/new-list")
  getContainerListFormEtrans(@Body() containerListDto: PostContainerListDto) {
    return this.containersService.createContainerList(containerListDto);
  }

  @Delete("/")
  deleteContainers(oid: Array<string>) {
    return this.containersService.deleteContainers(oid);
  }

  @Post("/confirm-list-py")
  postConCodeToPython(@Body() upsertContainer: PostContainerListResponseDto) {
    return this.containersService.sendConInfoToPython(upsertContainer);
  }
}
