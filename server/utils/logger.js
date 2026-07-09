const pino = require("pino");

const isTest = process.env.NODE_ENV === "test";
const isProduction = process.env.NODE_ENV === "production";

// Defaults: info (dev/prod) — request lines use compact fields (method, url, status, ms);
// error in test so Mocha stays readable but unexpected 5xx still surface.
const level = isTest
  ? process.env.LOG_LEVEL || "error"
  : process.env.LOG_LEVEL || "info";

const logger = pino({
  level,
  ...(isProduction || isTest
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            colorizeObjects: false,
            translateTime: "SYS:standard",
            customColors: "trace:white,debug:cyan,info:green,warn:yellow,error:red,fatal:bgRed",
          },
        },
      }),
});

module.exports = logger;
