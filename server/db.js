const mongoose = require("mongoose");
const { logEvents } = require("./middleware/logger");

if (process.env.NODE_ENV !== "test") {
  const useDevDb =
    process.env.NODE_ENV === "development" &&
    process.env.USE_PROD_DB !== "true";

  const address = useDevDb ? process.env.DB_DEVELOPMENT : process.env.DB_MAIN;

  //** Disable autoIndex in production so as not to slow down the server */
  const autoIndex = useDevDb ? true : false;

  console.log(`Database target: ${useDevDb ? "development" : "main"}`);

  mongoose.set("strictQuery", false);

  mongoose
    .connect(address, { autoIndex })
    // eslint-disable-next-line
    .then(() => console.log("Connection to database is established"))
    // eslint-disable-next-line
    .catch((err) => {
      console.error(err);
      console.log(`Connection error: ${err.reason}`);
    });

  // eslint-disable-next-line
  mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log",
    );
  });
}
