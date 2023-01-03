import { Injectable } from "@nestjs/common";
import { UpdateAlramHistoryDto } from "./dto/update-alram-history.dto";

@Injectable()
export class AlramHistoryService {
  findOne(id: number) {
    return `This action returns a #${id} alramHistory`;
  }

  update(id: number, updateAlramHistoryDto: UpdateAlramHistoryDto) {
    return `This action updates a #${id} alramHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} alramHistory`;
  }
}
