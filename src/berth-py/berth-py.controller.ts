import { Controller, Post, Body } from "@nestjs/common";
import { BerthPyService } from "./berth-py.service";
import { CreateBerthPyDto } from "./dto/create-berth-py.dto";

@Controller("berth-py")
export class BerthPyController {
  constructor(private readonly berthPyService: BerthPyService) {}

  @Post("/")
  create(@Body() data: Array<CreateBerthPyDto>) {
    return this.berthPyService.create(data);
  }
}
