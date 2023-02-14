import * as dotenv from "dotenv";
dotenv.config();
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DashboardModule } from "./dashboard/dashboard.module";
import { UserModule } from "./system/user/user.module";
import { AlramModule } from "./alram-system/alram/alram.module";
import { AuthModule } from "./auth/auth.module";
import { BerthPyModule } from "./berth-schedule/berth-py/berth-py.module";
import { HttpModule } from "@nestjs/axios";
import { AlramPushModule } from "./alram-system/alram-push/alram-push.module";
import { ContainersModule } from "./containers/containers.module";
import { AlramHistoryModule } from "./alram-system/alram-history/alram-history.module";
import { CommonScheduleModule } from "./berth-schedule/common-schedule/common-schedule.module";
import { ManagementModule } from "./system/management/management.module";
import { ShipBynameModule } from "./berth-schedule/ship-byname/ship-byname.module";
import { ShippingTimeModule } from "./berth-schedule/shipping-time/shipping-time.module";
import { BerthInfoModule } from "./berth-schedule/berth-info/berth-info.module";

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      timezone: "+09:00",
      logging: false,
    }),
    DashboardModule,
    UserModule,
    AlramModule,
    AuthModule,
    BerthPyModule,
    HttpModule,
    AlramPushModule,
    ContainersModule,
    BerthInfoModule,
    AlramHistoryModule,
    CommonScheduleModule,
    ManagementModule,
    ShipBynameModule,
    ShippingTimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
