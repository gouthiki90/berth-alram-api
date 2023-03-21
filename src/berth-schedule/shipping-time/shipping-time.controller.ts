import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ShippingTimeService } from "./shipping-time.service";
import { SearchShippingTimeDto } from "./dto/search-shipping-time.dto";

@Controller("shipping-time")
export class ShippingTimeController {
  constructor(private readonly shippingTimeService: ShippingTimeService) {}

  @Post("/")
  searchOfShippingTimeFromContainer(
    @Body() searchShippingTimeDto: SearchShippingTimeDto
  ) {
    return this.shippingTimeService.crawllingOfShippingTimeFromContainer(
      searchShippingTimeDto
    );
  }

  @Get()
  findAll() {
    return this.shippingTimeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shippingTimeService.findOne(+id);
  }
}
