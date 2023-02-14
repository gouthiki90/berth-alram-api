import { PartialType } from "@nestjs/mapped-types";
import { CreateAlramDto } from "./create-alram.dto";

export class UpdateAlramDto extends PartialType(CreateAlramDto) {}
