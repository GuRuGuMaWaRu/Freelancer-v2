import path from "path";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../.env.server") });
}
