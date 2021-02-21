import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Load environment variables.
  dotenv.config();
  console.log(process.env.JWT_SECRET);

  // Setup Nest.
  const app = await NestFactory.create(AppModule);
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
    const config = new DocumentBuilder()
      .setTitle("Giraffe Server")
      .setDescription(
        "In order to interact with the API from this documentation alone follow the following steps:\n" +
          "1. Register at the register route.\n" +
          "2. Login using the credentials at the login route.\n" +
          "3. Get the `access_token` from the response and enter it in the Authorization formk.\n"
      )
      .setVersion("1.0")
      .addSecurity("bearer", {
        bearerFormat: "JWT",
        type: "http",
        scheme: "bearer",
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }

  const port = process.env.PORT;
  await app.listen(port);
}

bootstrap();
