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

  /** 사전반입일 select and return */
  async findNumberInfo() {
    try {
      /** berthInfo all data list */
      const berthInfoList = await berthInfo.findAll();
      /** 사전반입일 데이터 중 ~일 전을 빼고 일자를 numbering 해서 return */
      const makeNumberBerthInfoDataList = berthInfoList.map((curr) => {
        if (curr.carryTiming && curr.dangerCarryTiming) {
          /** 사전반입일 */
          const carryTiming = curr.carryTiming.split("일 전");
          /** 위험물 사전반입일 */
          const dangerCarryTiming = curr.dangerCarryTiming.split("일 전");

          return {
            oid: curr.oid,
            turminalCode: curr.turminalCode,
            carryTiming: Number(carryTiming[0]),
            dangerCarryTiming: Number(dangerCarryTiming[0]),
          };
        }
      });

      return makeNumberBerthInfoDataList;
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException("not found berth info data");
    }
  }
}
