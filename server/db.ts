import mongoose from "mongoose";

import logger from "./utils/logger";

if (process.env.NODE_ENV !== "test") {
  const useDevDb =
    process.env.NODE_ENV === "development" &&
    process.env.USE_PROD_DB !== "true";

  const address = useDevDb ? process.env.DB_DEVELOPMENT : process.env.DB_MAIN;

  const autoIndex = useDevDb;

  logger.info(`Database target: ${useDevDb ? "development" : "main"}`);

  mongoose.set("strictQuery", false);

  mongoose
    .connect(address as string, { autoIndex })
    .then(() => logger.info("Connection to database is established"))
    .catch((err) => {
      logger.error({ err }, `Connection error: ${err.reason}`);
    });

  mongoose.connection.on("error", (err) => {
    const connectionError = err as NodeJS.ErrnoException & {
      hostname?: string;
    };

    logger.error(
      {
        err,
        no: "no" in connectionError ? connectionError.no : undefined,
        code: connectionError.code,
        syscall: connectionError.syscall,
        hostname: connectionError.hostname,
      },
      "MongoDB connection error",
    );
  });
}
