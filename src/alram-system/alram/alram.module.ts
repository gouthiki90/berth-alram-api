import { Module } from "@nestjs/common";
import { AlramService } from "./alram.service";
import { AlramController } from "./alram.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { subscriptionAlram } from "src/models";
import { AlramRepository } from "./alram.repository";
import { Utils } from "src/util/common.utils";
import { OffsetAlramDto } from "./dto/alram-offset-dto";
import { OffsetPagenatedAlramStateDataDto } from "./dto/off-set-pagenated-alram-state-data.dto";

@Module({
  imports: [SequelizeModule.forFeature([subscriptionAlram])],
  controllers: [AlramController],
  providers: [
    Array<OffsetAlramDto>,
    AlramService,
    AlramRepository,
    Utils,
    OffsetPagenatedAlramStateDataDto,
  ],
})
export class AlramModule {}
