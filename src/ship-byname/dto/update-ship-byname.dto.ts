import { PartialType } from "@nestjs/mapped-types";
import { CreateShipBynameDto } from "./create-ship-byname.dto";

export class UpdateShipBynameDto extends PartialType(CreateShipBynameDto) {}
