const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");
const pinoHttp = require("pino-http");

const AppError = require("./utils/appError");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const { clientRouter, projectRouter, userRouter } = require("./resources");

// Load env before logger so LOG_LEVEL from .env.server applies
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../.env.server") });
}

const logger = require("./utils/logger");

// Connect to mongo DB
require("./db");

const app = express();

// Structured request logging — compact fields at INFO (no full req/res dumps)
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

// Secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    hsts: {
      maxAge: 86400, // 60 days
      includeSubDomains: false,
    },
  }),
);

// Compress text data
app.use(compression());

// Body parser
app.use(express.json({ limit: "10kb" }));

// Set CORS headers so that React SPA is able to communicate with this server
app.use(cors(corsOptions));

// Set up routes
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/users", userRouter);

const clientBuildPath = path.join(__dirname, "..", "client", "dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) =>
    res.sendFile(path.join(clientBuildPath, "index.html")),
  );
} else {
  app.use("/", require("./resources/root"));
}

// Handle 404 (Not Found) errors
app.all("*", (req, res, next) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.resolve(__dirname, "views", "404.html"));
  } else {
    next(new AppError(404, `Cannot find ${req.originalUrl} on this server`));
  }
});

// Handle all errors
app.use(errorHandler);

// Connect to server (skip in test so supertest can use the app without binding to a port)
// Default 6040 — port 6000 is in Windows Hyper-V excluded range 5940-6039 (EACCES).
const PORT = process.env.PORT || 6040;

if (process.env.NODE_ENV !== "test") {
  mongoose.connection.once("open", () => {
    const server = app.listen(PORT, () =>
      logger.info(`Server is listening on port ${PORT}...`),
    );

    server.on("error", (err) => {
      if (err.code === "EACCES" || err.code === "EADDRINUSE") {
        logger.error(
          { err, port: PORT },
          `Cannot listen on port ${PORT}. Set PORT in .env.server (avoid 5940-6039 on Windows).`,
        );
      }

      throw err;
    });
  });
}

module.exports = app;
