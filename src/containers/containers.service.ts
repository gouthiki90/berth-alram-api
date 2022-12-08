import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { container } from "src/models";
import { Utils } from "src/util/common.utils";
import { ContainersReposiotry } from "./containers.repository";
import { PostContainerListResponseDto } from "./dto/post-container-list-response.dto";
import { PostContainerListDto } from "./dto/post-container-list.dto";
import { UpdateContainerDto } from "./dto/update-container.dto";

@Injectable()
export class ContainersService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly utils: Utils,
    private readonly httpService: HttpService,
    private readonly containersRepository: ContainersReposiotry
  ) {}

  async createContainerList(dto: PostContainerListDto) {
    const t = await this.seqeulize.transaction();
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

        /** 상태값을 확인하고 update */
        getContainerList.map((value) => {
          if (value.CNTR_STATUS === "78") {
            value.containerStatus = 1;
          }
        });

        for (const obj of getContainerList) {
          console.log({ ...obj, ...dto });
          await container.create({ ...obj, ...dto }, { transaction: t });
        }

        await t.commit();
        const newContainerList = await this.containersRepository.findAll();
        return newContainerList;
      }
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  findAll() {
    return `This action returns all containers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} container`;
  }

  update(id: number, updateContainerDto: UpdateContainerDto) {
    return `This action updates a #${id} container`;
  }

  remove(id: number) {
    return `This action removes a #${id} container`;
  }
}
