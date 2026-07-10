const allowedOrigins = require("./allowedOrigins");

const isDevLocalhost = (origin) =>
  /^http:\/\/localhost:\d+$/.test(origin ?? "");

const corsOptions = {
  origin: (origin, callback) => {
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      !origin ||
      (process.env.NODE_ENV === "development" && isDevLocalhost(origin))
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
