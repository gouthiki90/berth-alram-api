import { Module } from "@nestjs/common";
import { CommonCodeService } from "./common-code.service";
import { CommonCodeController } from "./common-code.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { commonCodeMain, commonCodeSub } from "src/models";
import { Utils } from "src/util/common.utils";

@Module({
  imports: [SequelizeModule.forFeature([commonCodeMain, commonCodeSub])],
  controllers: [CommonCodeController],
  providers: [CommonCodeService, Utils],
})
export class CommonCodeModule {}
