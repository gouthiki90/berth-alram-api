import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
import * as fs from "fs";

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync("./secrets/private-key.pem"),
  //   cert: fs.readFileSync("./secrets/public-certificate.pem"),
  // };

  const app = await NestFactory.create(AppModule);
  // the next two lines did the trick
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.enableCors();
  await app.listen(3040);
}
bootstrap();
