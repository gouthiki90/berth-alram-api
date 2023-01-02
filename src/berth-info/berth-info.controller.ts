import { Controller, Get } from "@nestjs/common";
import { BerthInfoService } from "./berth-info.service";
@Controller("berth-info")
export class BerthInfoController {
  constructor(private readonly berthInfoService: BerthInfoService) {}

  @Get()
  findAll() {
    return this.berthInfoService.findAll();
  }
}
