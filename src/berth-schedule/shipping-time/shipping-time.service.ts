import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
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
  /** TLLU2006874 */
  /** 컨넘버를 받고 양하 시간 크롤링 */
  async crawllingOfShippingTimeFromContainerBNCT(
    searchShippingTimeDto: SearchShippingTimeDto
  ) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${
          process.env.BNCT_SHIPPING_URL +
          `?cntrNo=${searchShippingTimeDto.containerNumber}`
        }`
      );

      // Logger.debug(response.data);

      const root = parse(response.data);
      const selectResult = root.querySelector(".yangha-result");

      Logger.debug(selectResult.text);

      return { message: "test..." };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async crawllingOfShippingTimeFromContainerBPTG() {
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
