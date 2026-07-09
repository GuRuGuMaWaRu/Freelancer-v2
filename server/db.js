const mongoose = require("mongoose");

const logger = require("./utils/logger");

if (process.env.NODE_ENV !== "test") {
  const useDevDb =
    process.env.NODE_ENV === "development" &&
    process.env.USE_PROD_DB !== "true";

  const address = useDevDb ? process.env.DB_DEVELOPMENT : process.env.DB_MAIN;

  //** Disable autoIndex in production so as not to slow down the server */
  const autoIndex = useDevDb ? true : false;

  logger.info(`Database target: ${useDevDb ? "development" : "main"}`);

  mongoose.set("strictQuery", false);

  mongoose
    .connect(address, { autoIndex })
    .then(() => logger.info("Connection to database is established"))
    .catch((err) => {
      logger.error({ err }, `Connection error: ${err.reason}`);
    });

  mongoose.connection.on("error", (err) => {
    logger.error(
      {
        err,
        no: err.no,
        code: err.code,
        syscall: err.syscall,
        hostname: err.hostname,
      },
      "MongoDB connection error",
    );
  });
}
