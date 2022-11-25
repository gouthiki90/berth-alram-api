import { Injectable } from "@nestjs/common";

@Injectable()
export class LoginInterface {
  userId: string;
  password: any;
}
