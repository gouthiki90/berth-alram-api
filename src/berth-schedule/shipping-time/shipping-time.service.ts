import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { CreateShippingTimeDto } from "./dto/create-shipping-time.dto";
import { UpdateShippingTimeDto } from "./dto/update-shipping-time.dto";
import { parse } from "node-html-parser";
import { Sequelize } from "sequelize-typescript";
import { HttpService } from "@nestjs/axios";
import { SearchShippingTimeDto } from "./dto/search-shipping-time.dto";

@Injectable()
export class ShippingTimeService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly httpService: HttpService
  ) {}
  /** 컨넘버를 받고 양하 시간 크롤링 */
  async crawllingOfShippingTimeFromContainer(
    searchShippingTimeDto: SearchShippingTimeDto
  ) {
    try {
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
