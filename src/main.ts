import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
import * as fs from "fs";

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CRT_PATH),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  // the next two lines did the trick
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.enableCors();
  await app.listen(443);
}
bootstrap();
