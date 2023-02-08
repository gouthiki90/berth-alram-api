import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

  @Post()
  create(@Body() createShipBynameDto: CreateShipBynameDto) {
    return this.shipBynameService.create(createShipBynameDto);
  }

  @Get()
  findAll() {
    return this.shipBynameService.findAll();
  }

  @Get("/")
  findOne(@Query() query: FindShipBynameQueryDto) {
    return this.shipBynameRepository.findOneForSubscripUser(query);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateShipBynameDto: UpdateShipBynameDto
  ) {
    return this.shipBynameService.update(+id, updateShipBynameDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shipBynameService.remove(+id);
  }
}
