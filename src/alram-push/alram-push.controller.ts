import { Controller } from "@nestjs/common";
import { AlramPushService } from "./alram-push.service";

@Controller("alram-push")
export class AlramPushController {
  constructor(private readonly alramPushService: AlramPushService) {}
}
