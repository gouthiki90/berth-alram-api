import { Controller, UseFilters, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ErrorHandler } from "src/error-handler/error-handler";
import { AlramPushService } from "./alram-push.service";

@UseGuards(JwtAuthGuard)
@UseFilters(ErrorHandler)
@Controller("alram-push")
export class AlramPushController {
  constructor(private readonly alramPushService: AlramPushService) {}
}
