import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { CreateShippingTimeDto } from "./dto/create-shipping-time.dto";
import { UpdateShippingTimeDto } from "./dto/update-shipping-time.dto";
import { parse } from "node-html-parser";

@Injectable()
export class ShippingTimeService {
  create() {
    try {
      const testing = "<h1>할루</h1>";
      const root = parse(testing);
      Logger.debug(root);
      Logger.debug(root.text);

      return { message: "test..." };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
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
