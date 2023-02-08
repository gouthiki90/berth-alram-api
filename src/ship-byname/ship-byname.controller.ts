import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from "@nestjs/common";
import { ShipBynameService } from "./ship-byname.service";
import { CreateShipBynameDto } from "./dto/create-ship-byname.dto";
import { UpdateShipBynameDto } from "./dto/update-ship-byname.dto";
import { ShipBynameRepository } from "./ship-byname.repository";
import { FindShipBynameQueryDto } from "./dto/find-ship-byname-qeury.dto";

@Controller("ship-byname")
export class ShipBynameController {
  constructor(
    private readonly shipBynameService: ShipBynameService,
    private readonly shipBynameRepository: ShipBynameRepository
  ) {}

  @Post("/")
  create(@Body() createShipBynameDto: CreateShipBynameDto) {
    return this.shipBynameService.create(createShipBynameDto);
  }

  @Get("/")
  findOne(@Query() query: FindShipBynameQueryDto) {
    return this.shipBynameRepository.findOneForSubscripUser(query);
  }

  @Put("/")
  update(@Body() updateShipBynameDto: UpdateShipBynameDto) {
    return this.shipBynameService.update(updateShipBynameDto);
  }

  @Delete("/:oid")
  remove(@Param("oid") oid: string) {
    return this.shipBynameService.remove(oid);
  }
}
