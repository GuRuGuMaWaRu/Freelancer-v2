import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const VITE_PORTS = [3000, 3001, 3002];

const API_PORTS = [
  6040, 7040, 8070, 8765, 9456, 10240, 11000, 12000, 13000, 14000, 15000,
  16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000,
];

function getPortsToCheck(root) {
  const ports = new Set([...VITE_PORTS, ...API_PORTS]);
  const portFile = join(root, "client", ".api-port.local");

  if (existsSync(portFile)) {
    const port = Number(readFileSync(portFile, "utf8").trim());

    if (Number.isInteger(port) && port > 0) {
      ports.add(port);
    }
  }

  return [...ports].sort((a, b) => a - b);
}

function getListeningPids(port) {
  if (process.platform === "win32") {
    const output = execSync("netstat -ano -p tcp", { encoding: "utf8" });
    const pids = new Set();
    const portPattern = new RegExp(`:${port}\\s+\\S+\\s+LISTENING\\s+(\\d+)`, "i");

    for (const line of output.split(/\r?\n/)) {
      const match = line.match(portPattern);

      if (match) {
        pids.add(Number(match[1]));
      }
    }

    return [...pids];
  }

  try {
    const output = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    return output
      .split(/\r?\n/)
      .map((value) => Number(value.trim()))
      .filter((pid) => Number.isInteger(pid) && pid > 0);
  } catch {
    return [];
  }
}

function killPid(pid, dryRun) {
  if (dryRun) {
    return true;
  }

  if (process.platform === "win32") {
    execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    return true;
  }

  process.kill(pid, "SIGTERM");
  return true;
}

function killDevPorts(root, { dryRun = false, skipPid = process.pid } = {}) {
  const ports = getPortsToCheck(root);
  const killed = new Map();

  for (const port of ports) {
    const pids = getListeningPids(port);

    for (const pid of pids) {
      if (pid === skipPid) {
        continue;
      }

      const boundPorts = killed.get(pid) ?? [];
      boundPorts.push(port);
      killed.set(pid, boundPorts);
    }
  }

  const results = [];

  for (const [pid, boundPorts] of killed) {
    const portList = boundPorts.join(", ");

    if (dryRun) {
      results.push({ pid, ports: boundPorts, killed: false });
      continue;
    }

    try {
      killPid(pid, dryRun);
      results.push({ pid, ports: boundPorts, killed: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({ pid, ports: boundPorts, killed: false, error: message });
    }
  }

  return results;
}

export { API_PORTS, VITE_PORTS, getPortsToCheck, killDevPorts };
