import type { Application } from "express";
import type { Server } from "http";

const DEFAULT_PREFERRED_PORT = 6040;

/** Spread across ranges to reduce overlap with shifting Windows Hyper-V exclusions. */
const FALLBACK_PORTS = [
  6040, 7040, 8070, 8765, 9456, 10240, 11000, 12000, 13000, 14000, 15000,
  16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000,
];

interface ListenLogger {
  info: (obj: object, msg?: string) => void;
  warn: (obj: object, msg?: string) => void;
}

function getListenPortCandidates(): number[] {
  const preferred = Number(process.env.PORT) || DEFAULT_PREFERRED_PORT;
  const candidates = [preferred, ...FALLBACK_PORTS.filter((port) => port !== preferred)];

  return [...new Set(candidates)];
}

function listenWithPortFallback(
  app: Application,
  port: number,
): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      reject(err);
    });
  });
}

async function startServerWithPortFallback(
  app: Application,
  log: ListenLogger,
): Promise<{ server: Server; port: number }> {
  const candidates = getListenPortCandidates();
  const preferred = candidates[0];
  let lastError: NodeJS.ErrnoException | undefined;

  for (const port of candidates) {
    try {
      const server = await listenWithPortFallback(app, port);

      if (port !== preferred) {
        log.warn(
          { port, preferred },
          "Preferred port unavailable; using fallback listen port",
        );
      }

      return { server, port };
    } catch (err) {
      const error = err as NodeJS.ErrnoException;

      if (error.code !== "EACCES" && error.code !== "EADDRINUSE") {
        throw error;
      }

      lastError = error;
    }
  }

  throw lastError ?? new Error(
    `Could not bind to any candidate port (${candidates.join(", ")}). ` +
      "On Windows, inspect Hyper-V exclusions: netsh interface ipv4 show excludedportrange protocol=tcp",
  );
}

export {
  DEFAULT_PREFERRED_PORT,
  FALLBACK_PORTS,
  getListenPortCandidates,
  startServerWithPortFallback,
};
