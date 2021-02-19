import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  // Load environment variables.
  dotenv.config();

  // Enable CORS.
  if (process.env.NODE_ENV === "development") {
    app.enableCors();
  }

  // Set-up Swagger code generation.
  if (process.env.NODE_ENV === "development") {
    const config = new DocumentBuilder()
      .setTitle("Giraffe API")
      .setDescription("The description of the Giraffe REST API")
      .setVersion("0.1")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }

  const port = process.env.PORT;
  await app.listen(port);
}

bootstrap();
