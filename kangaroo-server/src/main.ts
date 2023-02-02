// Load environment variables.
import * as dotenv from "dotenv";
import { SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import openAPIConfig from "./common/open-api/open-api.config";
import { clientGenerationTask } from "./common/tasks/client-gen.task";
import { ConfigService, Environment } from "./env.validation";

dotenv.config();

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

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  const configService = app.get(ConfigService);

  // Enable CORS.
  if (configService.NODE_ENV === Environment.DEVELOPMENT) {
    app.enableCors();
  }

  // Set-up Swagger code generation.
  if (configService.NODE_ENV === Environment.DEVELOPMENT) {
    const document = SwaggerModule.createDocument(app, openAPIConfig.build());
    SwaggerModule.setup("api", app, document);
  }

  const port = configService.PORT;
  await app.listen(port);
}
