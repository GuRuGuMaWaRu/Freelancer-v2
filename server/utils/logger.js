const pino = require("pino");

const isTest = process.env.NODE_ENV === "test";
const isProduction = process.env.NODE_ENV === "production";

// Test defaults to `error` so Mocha stays readable but unexpected 5xx still surface.
// Set LOG_LEVEL when running tests to override (e.g. LOG_LEVEL=debug npm run server:test).
const level = isTest
  ? process.env.LOG_LEVEL || "error"
  : process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

const logger = pino({
  level,
  ...(isProduction || isTest
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        },
      }),
});

module.exports = logger;
