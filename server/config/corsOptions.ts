import type { CorsOptions } from "cors";

import allowedOrigins from "./allowedOrigins";

const isDevLocalhost = (origin: string | undefined) =>
  /^http:\/\/localhost:\d+$/.test(origin ?? "");

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (
      allowedOrigins.indexOf(origin ?? "") !== -1 ||
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

export default corsOptions;
