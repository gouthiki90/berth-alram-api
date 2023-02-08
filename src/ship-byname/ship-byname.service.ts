import { Injectable } from "@nestjs/common";
import { CreateShipBynameDto } from "./dto/create-ship-byname.dto";
import { UpdateShipBynameDto } from "./dto/update-ship-byname.dto";

@Injectable()
export class ShipBynameService {
  create(createShipBynameDto: CreateShipBynameDto) {
    return "This action adds a new shipByname";
  }

  findAll() {
    return `This action returns all shipByname`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shipByname`;
  }

  update(id: number, updateShipBynameDto: UpdateShipBynameDto) {
    return `This action updates a #${id} shipByname`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipByname`;
  }
}
