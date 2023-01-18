import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { berthInfo } from "src/models";

@Injectable()
export class BerthInfoRepository {
  async findAllBerthInfo() {
    try {
      return await berthInfo.findAll();
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException("발견한 데이터가 없습니다.");
    }
  }
}
