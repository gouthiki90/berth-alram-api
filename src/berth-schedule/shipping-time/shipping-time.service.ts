import { Injectable } from "@nestjs/common";
import { CreateShippingTimeDto } from "./dto/create-shipping-time.dto";
import { UpdateShippingTimeDto } from "./dto/update-shipping-time.dto";

@Injectable()
export class ShippingTimeService {
  create(createShippingTimeDto: CreateShippingTimeDto) {
    return "This action adds a new shippingTime";
  }

  findAll() {
    return `This action returns all shippingTime`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shippingTime`;
  }

  update(id: number, updateShippingTimeDto: UpdateShippingTimeDto) {
    return `This action updates a #${id} shippingTime`;
  }

  remove(id: number) {
    return `This action removes a #${id} shippingTime`;
  }
}
