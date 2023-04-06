import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateUserAuthDto {
  /** 키값 */
  oid?: string;
  /** 권한 코드 */
  role?: string;
}
