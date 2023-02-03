// Load environment variables.
import * as dotenv from "dotenv";
dotenv.config();

import { SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import config from "./common/open-api/open-api.config";
import { clientGenerationTask } from "./common/tasks/client-gen.task";
import { json } from "express";

// Start API client generation task if ENV is set.
if (process.env.CLIENT_GEN) {
  clientGenerationTask();
} else {
  bootstrap();
}

async function bootstrap() {
  // Setup Nest.
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  // Increase json body limit to 1mb for uploads in base64 (default was "100kb")
  app.use(json({ limit: "1mb" }));

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
