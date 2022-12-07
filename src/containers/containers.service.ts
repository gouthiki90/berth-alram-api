import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { container } from "src/models";
import { Utils } from "src/util/common.utils";
import { CreateContainerDto } from "./dto/create-container.dto";
import { PostContainerListDto } from "./dto/post-container-list.dto";
import { UpdateContainerDto } from "./dto/update-container.dto";

@Injectable()
export class ContainersService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly utils: Utils,
    private readonly httpService: HttpService
  ) {}
  async create(data: CreateContainerDto) {
    const t = await this.seqeulize.transaction();

    try {
      const CON_OID = this.utils.getOid(container, "container");
    } catch (error) {
      console.log(error);
    }
  }

  async createContainerList(dto: PostContainerListDto) {
    const t = await this.seqeulize.transaction();
    const URL = process.env.ETRANS_URL;
    const TEST_DEFAULT_VALUE = {
      dma_search: {
        KLNET_ID: "",
        SEARCH_DATA: "FSCU5909470",
        NOTICE_CNT: 25,
      },
    };
    try {
      const response = await this.httpService.axiosRef.post(
        URL,
        TEST_DEFAULT_VALUE
      );

      const result = response.data;
      console.log(result);
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
