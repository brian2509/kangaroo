import { Injectable, Logger, NestMiddleware } from "@nestjs/common";

import { NextFunction, Request, Response } from "express";

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = request;
    const userAgent = request.get("user-agent") || "";

    response.on("close", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");
      const body = request.body;
      const params = request.params;

      const message = `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip} ${
        Object.keys(params).length === 0 && Object.keys(body).length === 0
          ? ""
          : `\n${JSON.stringify(
              {
                params,
                body,
              },
              null,
              1
            )}`
      }`;

      if (statusCode >= 200 && statusCode <= 299) {
        this.logger.log(message);
      } else {
        this.logger.warn(message);
      }
    });

    next();
  }
}
