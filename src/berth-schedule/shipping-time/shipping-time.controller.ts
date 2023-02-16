import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ShippingTimeService } from "./shipping-time.service";
import { CreateShippingTimeDto } from "./dto/create-shipping-time.dto";
import { UpdateShippingTimeDto } from "./dto/update-shipping-time.dto";

@Controller("shipping-time")
export class ShippingTimeController {
  constructor(private readonly shippingTimeService: ShippingTimeService) {}

  @Post()
  create(@Body() createShippingTimeDto: CreateShippingTimeDto) {
    return this.shippingTimeService.create(createShippingTimeDto);
  }

  @Get()
  findAll() {
    return this.shippingTimeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shippingTimeService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateShippingTimeDto: UpdateShippingTimeDto
  ) {
    return this.shippingTimeService.update(+id, updateShippingTimeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shippingTimeService.remove(+id);
  }
}
