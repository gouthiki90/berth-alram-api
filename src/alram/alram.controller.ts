import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseFilters,
} from "@nestjs/common";
import { OffsetPagingInfoDto } from "src/dashboard/dto/offset-page-info.dto";
import { ErrorHandler } from "src/error-handler/error-handler";
import { AlramService } from "./alram.service";
import { CreateAlramDto } from "./dto/create-alram.dto";
import { RemoveAlramDto } from "./dto/remove-alram.dto";
import { UpdateAlramDto } from "./dto/update-alram.dto";

@UseFilters(ErrorHandler)
@Controller("alram")
export class AlramController {
  constructor(private readonly alramService: AlramService) {}

  @Post("/")
  create(@Body() data: Array<CreateAlramDto>) {
    return this.alramService.create(data);
  }

  @Post("/page-info/:oid")
  findOne(@Param("oid") oid: string, @Body() pageInfo: OffsetPagingInfoDto) {
    return this.alramService.makePageInfoForAlramList(pageInfo, oid);
  }

  @Put("/")
  update(@Body() updateAlramDto: UpdateAlramDto) {
    return this.alramService.update(updateAlramDto);
  }

  @Delete("/:oid")
  remove(@Body() data: Array<RemoveAlramDto>) {
    return this.alramService.remove(data);
  }
}
