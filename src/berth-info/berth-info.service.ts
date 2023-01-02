import { Injectable } from "@nestjs/common";

@Injectable()
export class BerthInfoService {
  findAll() {
    return `This action returns all berthInfo`;
  }
}
