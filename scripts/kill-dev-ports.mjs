import { killDevPorts } from "./dev-ports.mjs";

const dryRun = process.argv.includes("--dry-run");
const results = killDevPorts(process.cwd(), { dryRun });

if (results.length === 0) {
  console.log("[dev:kill] No stale dev listeners found.");
  process.exit(0);
}

for (const result of results) {
  const portList = result.ports.join(", ");

  if (dryRun) {
    console.log(`[dev:kill] Would kill PID ${result.pid} (ports: ${portList})`);
    continue;
  }

  if (result.killed) {
    console.log(`[dev:kill] Killed PID ${result.pid} (ports: ${portList})`);
    continue;
  }

  console.warn(
    `[dev:kill] Failed to kill PID ${result.pid} (ports: ${portList}): ${result.error}`,
  );
}
