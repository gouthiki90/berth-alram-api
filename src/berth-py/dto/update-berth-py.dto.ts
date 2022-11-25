import { PartialType } from "@nestjs/mapped-types";
import { CreateBerthPyDto } from "./create-berth-py.dto";

export class UpdateBerthPyDto extends PartialType(CreateBerthPyDto) {
  oid: string;
  trminlCode?: string;
  berthCode?: string;
  trminlVoyg?: string;
  wtorcmpCode?: string;
  trminlShipnm?: string;
  shipRute?: string;
  csdhpPrarnde?: string;
  tkoffPrarnde?: string;
  csdhpDrc?: string;
  workStarDay?: string;
  workFiniDay?: string;
  carryFiniDay?: string;
  landngQy?: string;
  shipngQy?: string;
  reshmtQy?: string;
  predBerth?: string;
  shipment?: string;
  shifting?: string;
}
