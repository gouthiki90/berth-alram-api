import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  oid?: string;
  userId: string;
  bizName: string;
  contact?: string;
  managerTel?: string;
  managerName?: string;
}