import { Controller, Post, Body, UseFilters } from "@nestjs/common";
import { ErrorHandler } from "src/error-handler/error-handler";
import { BerthPyService } from "./berth-py.service";
import { CreateBerthPyDto } from "./dto/create-berth-py.dto";

@UseFilters(ErrorHandler)
@Controller("berth-py")
export class BerthPyController {
  constructor(private readonly berthPyService: BerthPyService) {}

  @Post("/")
  create(@Body() data: Array<CreateBerthPyDto>) {
    return this.berthPyService.create(data);
  }
}
