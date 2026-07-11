import { spawn } from "node:child_process";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { killDevPorts } from "./dev-ports.mjs";

const root = process.cwd();
const portFile = join(root, "client", ".api-port.local");
const tsxCli = join(root, "node_modules", "tsx", "dist", "cli.mjs");
const viteCli = join(root, "client", "node_modules", "vite", "bin", "vite.js");
const useProdDb = process.argv.includes("--prod-db");
const skipKill = process.argv.includes("--no-kill");
const modeLabel = useProdDb ? "prod" : "dev";

function waitForFile(filePath, timeoutMs) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      if (existsSync(filePath)) {
        resolve(undefined);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error(`Timed out waiting for ${filePath}`));
        return;
      }

      setTimeout(check, 200);
    };

    check();
  });
}

function prefixStream(label, stream, output) {
  let buffer = "";

  stream.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.length > 0) {
        output.write(`[${label}] ${line}\n`);
      }
    }
  });
}

function spawnWithPrefix(label, command, args, options) {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    ...options,
  });

  prefixStream(label, child.stdout, process.stdout);
  prefixStream(label, child.stderr, process.stderr);

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    if (code && code !== 0) {
      process.exit(code);
    }
  });

  return child;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function ensureDevBinaries() {
  const missing = [tsxCli, viteCli].filter((path) => !existsSync(path));

  if (missing.length === 0) {
    return;
  }

  console.error(
    "[dev] Missing dev binaries. Run `npm install` at the repo root and `npm install --prefix client`.",
  );
  console.error(`[dev] Not found: ${missing.join(", ")}`);
  process.exit(1);
}

async function main() {
  ensureDevBinaries();

  if (!skipKill) {
    const killed = killDevPorts(root);

    if (killed.length > 0) {
      console.log(`[${modeLabel}] Cleared ${killed.length} stale dev listener(s)`);

      if (process.platform === "win32") {
        await sleep(500);
      }
    }
  }

  if (existsSync(portFile)) {
    unlinkSync(portFile);
  }

  const serverEnv = {
    ...process.env,
    NODE_ENV: "development",
    ...(useProdDb ? { USE_PROD_DB: "true" } : {}),
  };

  const server = spawnWithPrefix(
    "server",
    process.execPath,
    [tsxCli, "watch", "server/app.ts"],
    {
      cwd: root,
      env: serverEnv,
    },
  );

  let client;

  const shutdown = () => {
    if (client) {
      client.kill();
    }

    server.kill();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  try {
    await waitForFile(portFile, 30000);
    const port = readFileSync(portFile, "utf8").trim();

    console.log(
      `[${modeLabel}] API ready on http://localhost:${port}/api/v1 — starting Vite (proxy target: ${port})`,
    );
    console.log(
      `[${modeLabel}] Request logs appear as [server] lines. 2xx = INFO, 4xx = WARN.`,
    );

    client = spawnWithPrefix(
      "client",
      process.execPath,
      [viteCli],
      {
        cwd: join(root, "client"),
        env: {
          ...process.env,
          VITE_API_PORT: port,
          VITE_STRICT_PORT: "true",
        },
      },
    );
  } catch (err) {
    console.error(err.message);
    server.kill();
    process.exit(1);
  }
}

main();
