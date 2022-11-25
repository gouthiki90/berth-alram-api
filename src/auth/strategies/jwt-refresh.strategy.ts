import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwt_decode from "jwt-decode";
import { LoginInterface } from "src/user/interface/login.interface";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token"
) {
  constructor(private readonly userService: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: any) {
    console.log(req);
    const decoded: LoginInterface = jwt_decode(
      req.headers.authorization.replace("Bearer ", "")
    );
    console.log(decoded);
    if (!decoded) return null;

    return this.userService.getUserInfo(decoded.userId);
  }
}
