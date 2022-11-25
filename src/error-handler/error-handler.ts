import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";

@Catch() // 모두 캐치
export class ErrorHandler extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    // const next = http.getNext<NextFunction>();

    console.log(exception);

    res.status(500).json({
      errorName: exception.name,
      stackTrace: exception.stack,
      statusCode: 500,
      message: exception.message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
