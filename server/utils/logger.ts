import pino from "pino";

const isTest = process.env.NODE_ENV === "test";
const isProduction = process.env.NODE_ENV === "production";

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
            customColors:
              "trace:white,debug:cyan,info:green,warn:yellow,error:red,fatal:bgRed",
          },
        },
      }),
});

export default logger;
