import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as dotenv from "dotenv";
dotenv.config();
import * as jwt from "jsonwebtoken";
import { getTokenInfo } from "src/common/jwt.fn";

interface User {
  oid: string;
  userId: string;
  role: string;
}

@Injectable()
export class AuthService {
  login(user: User) {
    return getTokenInfo(user);
  }

  verify(jwtString: string) {
    console.log("asdfasdf", jwtString);
    try {
      const payload = jwt.verify(jwtString, process.env.JWT_SECRET) as (
        | jwt.JwtPayload
        | string
      ) &
        User;

      const { userId, oid, role } = payload;

      return {
        oid: oid,
        userId: userId,
        role: role,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
