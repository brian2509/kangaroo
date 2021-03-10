import { DocumentBuilder } from "@nestjs/swagger";

const config = new DocumentBuilder()
  .setTitle("Kangaroo Server")
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
  });

export default config;
