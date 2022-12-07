import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ContainersService } from "./containers.service";
import { CreateContainerDto } from "./dto/create-container.dto";
import { PostContainerListDto } from "./dto/post-container-list.dto";
import { UpdateContainerDto } from "./dto/update-container.dto";

@Controller("containers")
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post("/new-list")
  getContainerListFormEtrans(@Body() containerListDto: PostContainerListDto) {
    return this.containersService.createContainerList(containerListDto);
  }

  @Get()
  findAll() {
    return this.containersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.containersService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateContainerDto: UpdateContainerDto
  ) {
    return this.containersService.update(+id, updateContainerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.containersService.remove(+id);
  }
}
