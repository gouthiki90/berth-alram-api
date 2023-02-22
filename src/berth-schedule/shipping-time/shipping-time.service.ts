import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { parse } from "node-html-parser";
import { Sequelize } from "sequelize-typescript";
import { HttpService } from "@nestjs/axios";
import { SearchShippingTimeDto } from "./dto/search-shipping-time.dto";
import { TrminlCode } from "./interface/trminlCode.enums";

@Injectable()
export class ShippingTimeService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly httpService: HttpService
  ) {}
  /** TLLU2006874 */
  /** 컨넘버를 받고 양하 시간 크롤링 */
  async crawllingOfShippingTimeFromContainer(
    searchShippingTimeDto: SearchShippingTimeDto
  ) {
    try {
      switch (searchShippingTimeDto.trminlCode) {
        case TrminlCode.BNCT:
          await this.crawllingOfShippingTimeFromContainerBNCT(
            searchShippingTimeDto.containerNumber
          );
          break;
        case TrminlCode.BPTG:
          break;
        case TrminlCode.BPTS:
          break;
        case TrminlCode.DPCT:
          break;
        case TrminlCode.HJNC:
          break;
        case TrminlCode.HKT:
          break;
        case TrminlCode.HPNT:
          break;
        case TrminlCode.PNC:
          break;
        case TrminlCode.PNIT:
          break;
      }

      return { message: "test..." };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** BNCT */
  async crawllingOfShippingTimeFromContainerBNCT(containerNumber: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${process.env.BNCT_SHIPPING_URL + `?cntrNo=${containerNumber}`}`
      );

      // Logger.debug(response.data);

      const root = parse(response.data);
      const selectResult = root.querySelector(".yangha-result");

      Logger.debug(selectResult.text);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** BPTG */
  async crawllingOfShippingTimeFromContainerBPTG() {
    try {
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** HPNT */
  async crawllingOfShippingTimeFromContainerHPNT() {
    const url = "https://www.hpnt.co.kr/infoservice/vessel/vslStevedoreDtm.jsp";
    const examplePostDataObject = {
      cntrNo: ["emptyCntrNo", "length-equal-11"],
    };

    try {
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** BNMT
   * http://www.bnmt.co.kr/ebiz/?code=0103
   * POST
   * 모선 : txtShip
   * 항차 : txtCall
   * 년 : txtYear
   * 선사 : txtOpr
   */

  /**
   * DPCT
   * http://www.dpct.co.kr/info/sunsuk/E71W004S.asp?start=ok&txtCntrNo=TLLU2006874
   */

  /**
   * HJNC
   * location.href='esvc/cntr/info'
   * https://www.hjnc.co.kr/esvc/cntr/info/data?cntrNo=TLLU2006874&CNTR_UID=
   * cntrNo: 
      TLLU2006874
      CNTR_UID: 
   */

  /**
   * HKT
   * https://custom.hktl.com/jsp/T03/bonsundtl.jsp
   * POST
   * 컨넘버 cntno
   */

  /**
   * PNC
   * https://svc.pncport.com/info/CMS/Ship/ShipScheduleTime.pnc?mCode=MN085
   * POST
   * 컨넘버 SCONTNO
   * POINT: 
      CONTNO: 
      TLLU2006874
      mCode: 
   */

  findAll() {
    return `This action returns all shippingTime`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shippingTime`;
  }
}
