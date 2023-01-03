import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { berthStatSchedule, container } from "src/models";
import { Utils } from "src/util/common.utils";
import { ContainersReposiotry } from "./containers.repository";
import { DeleteContainerDto } from "./dto/delete-container.dto";
import { PostContainerListResponseDto } from "./dto/post-container-list-response.dto";
import { PostContainerListDto } from "./dto/post-container-list.dto";

@Injectable()
export class ContainersService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly utils: Utils,
    private readonly httpService: HttpService,
    private readonly containersRepository: ContainersReposiotry
  ) {}

  /** 새로운 컨테이너 검색 시 create && select */
  async createContainerList(dto: PostContainerListDto) {
    const t = await this.seqeulize.transaction();
    const TODAY = new Date();
    const URL = process.env.ETRANS_URL;
    const TEST_DEFAULT_VALUE = {
      dma_search: {
        KLNET_ID: "",
        SEARCH_DATA: `${dto.postInfo}`,
        NOTICE_CNT: 25,
      },
    };
    try {
      const response = await this.httpService.axiosRef.post(
        URL,
        TEST_DEFAULT_VALUE
      );

      const containerDataResult: PostContainerListResponseDto = response.data;

      if (containerDataResult.rsMsg.statusCode === "S") {
        const getContainerList = containerDataResult.dma_tracking;

        /** 상태값 바꾸기 전에 접안예정일 조건 추가하기 */
        const berthData = await berthStatSchedule.findOne({
          where: { oid: dto.berthOid },
        });

        const BERTH_DAY = new Date(berthData.csdhpPrarnde).getDate();

        const ONE_DAYS_AGO = [
          new Date(TODAY.setDate(BERTH_DAY - 1)).getDate(),
          "1일",
        ];
        const TOW_DAYS_AGO = [
          new Date(TODAY.setDate(BERTH_DAY - 2)).getDate(),
          "2일",
        ];
        const THREE_DAYS_AGO = [
          new Date(TODAY.setDate(BERTH_DAY - 3)).getDate(),
          "3일",
        ];
        const FOUR_DAYS_AGO = [
          new Date(TODAY.setDate(BERTH_DAY - 4)).getDate(),
          "4일",
        ];
        const FIVE_DAYS_AGO = [
          new Date(TODAY.setDate(BERTH_DAY - 5)).getDate(),
          "5일",
        ];

        /** 상태값을 확인하고 update */
        getContainerList.map((value) => {
          const CON_DAY = new Date(value.STATUS_DT).getDate();
          if (ONE_DAYS_AGO[0] === CON_DAY && value.CNTR_STATUS === "78") {
            value.containerStatus = 1;
          } else if (
            TOW_DAYS_AGO[0] === CON_DAY &&
            value.CNTR_STATUS === "78"
          ) {
            value.containerStatus = 1;
          } else if (
            THREE_DAYS_AGO[0] === CON_DAY &&
            value.CNTR_STATUS === "78"
          ) {
            value.containerStatus = 1;
          } else if (
            FOUR_DAYS_AGO[0] === CON_DAY &&
            value.CNTR_STATUS === "78"
          ) {
            value.containerStatus = 1;
          } else if (
            FIVE_DAYS_AGO[0] === CON_DAY &&
            value.CNTR_STATUS === "78"
          ) {
            value.containerStatus = 1;
          } else if (value.CNTR_STATUS === "78") {
            value.containerStatus = 1;
          }
        });

        /** 중복 데이터 검열 */
        const containerDupleData = await container.findOne({
          where: { berthOid: dto.berthOid },
        });

        for (const obj of getContainerList) {
          if (
            !containerDupleData ||
            containerDupleData.CNTR_NO !== obj.CNTR_NO
          ) {
            const CON_OID = await this.utils.getOid(container, "container");
            await container.create(
              { ...obj, ...dto, oid: CON_OID },
              { transaction: t }
            );
          } else {
            await container.update(
              { ...obj, ...dto },
              { where: { oid: containerDupleData.oid }, transaction: t }
            );
          }
        }

        await t.commit();

        /** 해당 조건으로 데이터 보여주기 */
        const newContainerList = await this.containersRepository.findAll({
          berthOid: dto.berthOid,
          alramOid: dto.alramOid,
        });

        if (newContainerList.length === 0) {
          return { message: "조회된 데이터가 없습니다." };
        }

        return newContainerList;
      } else {
        await t.rollback();
        throw new InternalServerErrorException(
          "데이터를 가져오는 데에 실패했습니다."
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  /** 컨테이너 삭제 */
  async deleteContainers(data: DeleteContainerDto) {
    const t = await this.seqeulize.transaction();
    try {
      for (const obj of data.oid) {
        await container.destroy({ where: { oid: obj }, transaction: t });
      }
      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  /** 컨테이너 스케줄링을 위해 Python으로 요청 */
  async sendConInfoToPython(dto: PostContainerListResponseDto) {
    const t = await this.seqeulize.transaction();
    try {
      if (dto.rsMsg.statusCode === "S") {
        const getContainerList = dto.dma_tracking;

        /** 상태값을 확인하고 update */
        getContainerList.map((value) => {
          if (value.CNTR_STATUS === "78") {
            value.containerStatus = 1;
          }
        });

        for (const obj of getContainerList) {
          const CON_OID = await this.utils.getOid(container, "container");
          await container.upsert(
            { ...obj, ...dto, oid: CON_OID },
            { transaction: t }
          );
        }

        const result = await t.commit();
        return result;
      }
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }
}
