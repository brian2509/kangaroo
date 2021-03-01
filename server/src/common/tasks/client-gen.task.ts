// Load environment variables.
import * as dotenv from "dotenv";
dotenv.config();

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as fs from "fs";
import * as path from "path";
import { OpenApiNestFactory } from "nest-openapi-tools";
import { AppModule } from "../../app.module";
import config from "../open-api/open-api.config";

export async function clientGenerationTask() {
  const folderPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "app",
    "src",
    "api",
    "generated-typescript-api-client"
  );
  if (fs.existsSync(folderPath)) {
    fs.rmdirSync(folderPath, { recursive: true });
  }

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
    await OpenApiNestFactory.configure(app, config, {
      webServerOptions: {
        enabled: true,
        path: "api-docs",
      },
      fileGeneratorOptions: {
        enabled: true,
        outputFilePath: "./openapi.yaml", // or ./openapi.json
      },
      clientGeneratorOptions: {
        enabled: true,
        type: "typescript-axios",
        outputFolderPath: "../app/src/api/generated-typescript-api-client/src",
        additionalProperties:
          "apiPackage=clients,modelPackage=models,withoutPrefixEnums=true,withSeparateModelsAndApi=true",
        openApiFilePath: "./openapi.yaml", // or ./openapi.json
        skipValidation: true, // optional, false by default
      },
    });
  }

  const port = process.env.PORT;
  await app.listen(port);
  await app.close();

  // Clean up files.
  const openApiPath1 = path.join(__dirname, "..", "..", "..", "openapi.yaml");
  if (fs.existsSync(openApiPath1)) {
    fs.unlinkSync(openApiPath1);
  }
  const openApiPath2 = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "openapitools.json"
  );
  if (fs.existsSync(openApiPath2)) {
    fs.unlinkSync(openApiPath2);
  }
}
