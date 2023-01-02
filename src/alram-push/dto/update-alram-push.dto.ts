import { PartialType } from "@nestjs/mapped-types";
import { CreateAlramPushDto } from "./create-alram-push.dto";

export class UpdateAlramPushDto extends PartialType(CreateAlramPushDto) {}
