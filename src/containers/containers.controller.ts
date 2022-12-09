import { Controller, Post, Body } from "@nestjs/common";
import { ContainersService } from "./containers.service";
import { PostContainerListDto } from "./dto/post-container-list.dto";

@Controller("containers")
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post("/new-list")
  getContainerListFormEtrans(@Body() containerListDto: PostContainerListDto) {
    return this.containersService.createContainerList(containerListDto);
  }

  @Post("/confirm-list-py")
  postConCodeToPython() {
    return this.containersService.sendConInfoToPython();
  }
}
