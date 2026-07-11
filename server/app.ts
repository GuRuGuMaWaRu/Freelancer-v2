import "./env";

import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import pinoHttp from "pino-http";

import AppError from "./utils/appError";
import errorHandler from "./middleware/errorHandler";
import corsOptions from "./config/corsOptions";
import { clientRouter, projectRouter, userRouter } from "./resources";
import rootRouter from "./resources/root";
import logger from "./utils/logger";
import { startServerWithPortFallback } from "./utils/listen";
import { writeDevApiPort } from "./utils/writeDevApiPort";

import "./db";

const app = express();

app.use(
  pinoHttp({
    logger,
    quietReqLogger: true,
    quietResLogger: true,
    autoLogging:
      process.env.NODE_ENV === "test"
        ? false
        : {
            ignore: (req) =>
              req.method === "OPTIONS" ||
              req.url === "/favicon.ico" ||
              req.url.startsWith("/static/"),
          },
    customLogLevel(req, res, err) {
      if (res.statusCode >= 500 || err) {
        return "error";
      }

      if (res.statusCode >= 400) {
        return "warn";
      }

      return "info";
    },
    customSuccessObject(req, res, val) {
      return {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: val.responseTime,
      };
    },
    customErrorObject(req, res, err, val) {
      return {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: val.responseTime,
        err,
      };
    },
    customSuccessMessage(req, res) {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
    customErrorMessage(req, res) {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    hsts: {
      maxAge: 86400,
      includeSubDomains: false,
    },
  }),
);

app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(cors(corsOptions));

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/users", userRouter);

const clientBuildPath = path.join(__dirname, "..", "client", "dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.use("/", rootRouter);
}

app.all("*", (req, res, next) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.resolve(__dirname, "views", "404.html"));
  } else {
    next(new AppError(404, `Cannot find ${req.originalUrl} on this server`));
  }
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  mongoose.connection.once("open", () => {
    startServerWithPortFallback(app, logger)
      .then(({ port }) => {
        logger.info(`Server is listening on port ${port}...`);
        writeDevApiPort(port);
      })
      .catch((err) => {
        logger.error({ err }, "Failed to start HTTP server");
        process.exit(1);
      });
  });
}

export default app;
