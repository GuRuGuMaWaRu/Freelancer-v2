import fs from "fs";
import path from "path";

const DEV_API_PORT_FILE = path.join(__dirname, "../../client/.api-port.local");

function writeDevApiPort(port: number): void {
  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    return;
  }

  fs.writeFileSync(DEV_API_PORT_FILE, String(port), "utf8");
}

export { DEV_API_PORT_FILE, writeDevApiPort };
