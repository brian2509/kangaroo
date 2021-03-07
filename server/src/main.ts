// Load environment variables.
import * as dotenv from "dotenv";
dotenv.config();

import { SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as fs from "fs";
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface";
import { AppModule } from "./app.module";
import config from "./common/open-api/open-api.config";
import { clientGenerationTask } from "./common/tasks/client-gen.task";

// Start API client generation task if ENV is set.
if (process.env.CLIENT_GEN) {
  clientGenerationTask();
} else {
  bootstrap();
}

async function bootstrap() {
  // Load SSL certificated if set-up.
  let httpsOptions: HttpsOptions = {};
  if (process.env.SSL) {
    httpsOptions = {
      key: fs.readFileSync("./ssl/privkey.pem"),
      cert: fs.readFileSync("./ssl/cert.pem"),
      ca: fs.readFileSync("./ssl/chain.pem"),
    };
  }

  // Setup Nest.
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  // Enable CORS.
  if (process.env.NODE_ENV === "development") {
    app.enableCors();
  }

  // Set-up Swagger code generation.
  if (process.env.NODE_ENV === "development") {
    const document = SwaggerModule.createDocument(app, config.build());
    SwaggerModule.setup("api", app, document);
  }

  const port = process.env.PORT;
  await app.listen(port);
}
