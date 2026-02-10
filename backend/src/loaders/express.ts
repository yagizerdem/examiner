import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";

import { prefix, jwtSecretKey } from "../config";
import routes from "../api/routes/index";

import { logger } from "../utils/index";
import { rateLimiter } from "../api/middlewares";
import { HttpError } from "../types/error";
import { ErrorCode, ResultCode } from "../utils/helpers/codes";
import HttpStatusCode from "../utils/helpers/HttpStatusCode";

export default (app: Application): void => {
  process.on("uncaughtException", (error: Error) => {
    logger(
      ErrorCode.UNCAUGHT_EXCEPTION,
      null,
      error.message,
      "Uncaught Exception",
      "",
    );
  });

  process.on("unhandledRejection", (reason: unknown) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    logger(
      ErrorCode.UNHANDLED_REJECTION,
      null,
      message,
      "Unhandled Rejection",
      "",
    );
  });

  if (!jwtSecretKey) {
    logger(
      ErrorCode.ENV_ERROR,
      null,
      "Jwtprivatekey is not defined",
      "Process-Env",
      "",
    );
    process.exit(1);
  }

  app.enable("trust proxy");
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(compression());
  app.use(express.static("public"));
  app.disable("x-powered-by");
  app.disable("etag");

  app.use(rateLimiter);
  app.use(prefix, routes);

  app.get("/", (_req: Request, res: Response) => {
    return res.status(200).json({
      resultMessage: {
        en: "Project is successfully working...",
      },
      resultCode: "00004",
    });
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Content-Security-Policy-Report-Only", "default-src: https:");

    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT POST PATCH DELETE GET");
      return res.status(200).json({});
    }

    next();
  });

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    const error: HttpError = new HttpError(
      "Endpoint could not find!",
      ErrorCode.NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
    error.status = HttpStatusCode.NOT_FOUND;
    next(error);
  });

  // global error handler
  app.use(
    (error: HttpError, req: Request, res: Response, _next: NextFunction) => {
      const statusCode = error.status ?? 500;
      res.status(statusCode);

      let resultCode: ResultCode = ErrorCode.BAD_REQUEST;
      let level = "External Error";

      if (statusCode === 500) {
        resultCode = ErrorCode.SERVER_ERROR;
        level = "Server Error";
      } else if (statusCode === 404) {
        resultCode = ErrorCode.NOT_FOUND;
        level = "Client Error";
      }

      logger(
        resultCode,
        (req as any)?.user?._id ?? null,
        error.message,
        level,
        req,
      );

      return res.json({
        resultMessage: {
          en: error.message,
          tr: error.message,
        },
        resultCode,
      });
    },
  );
};
