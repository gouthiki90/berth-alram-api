import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserRepository } from "src/system/user/user.repository";
import { Utils } from "src/util/common.utils";
import { AuthService } from "./auth.service";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [PassportModule],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    Utils,
    UserRepository,
  ],
})
export class AuthModule {}
