import * as dotenv from "dotenv";
dotenv.config();
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DashboardModule } from "./dashboard/dashboard.module";
import { UserModule } from "./user/user.module";
import { AlramModule } from "./alram/alram.module";
import { AuthModule } from "./auth/auth.module";
import { BerthPyModule } from "./berth-py/berth-py.module";
import { HttpModule } from "@nestjs/axios";
import { AlramPushModule } from "./alram-push/alram-push.module";
import { ContainersModule } from "./containers/containers.module";
import { BerthInfoModule } from './berth-info/berth-info.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
