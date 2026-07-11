import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const DEFAULT_API_PORT = "6040";
const DEFAULT_DEV_PORT = 3000;
const DEV_API_PORT_FILE = ".api-port.local";

function resolveApiPort(env: Record<string, string>): string {
  const portFile = join(process.cwd(), DEV_API_PORT_FILE);

  if (existsSync(portFile)) {
    return readFileSync(portFile, "utf8").trim();
  }

  return env.VITE_API_PORT || DEFAULT_API_PORT;
}

function apiProxyPlugin(apiPort: string) {
  return {
    name: "api-proxy-info",
    configureServer(server: { printUrls: () => void; config: { server?: { port?: number } } }) {
      const devPort = server.config.server?.port ?? DEFAULT_DEV_PORT;

      console.log(
        `Proxy /api → http://localhost:${apiPort} (open http://localhost:${devPort})`,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = resolveApiPort(env);
  const devPort = Number(env.VITE_PORT) || DEFAULT_DEV_PORT;
  const strictPort = env.VITE_STRICT_PORT === "true";

  return {
    plugins: [react(), tsconfigPaths(), apiProxyPlugin(apiPort)],
    server: {
      port: devPort,
      strictPort,
      proxy: {
        "/api": {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      environmentOptions: {
        jsdom: {
          url: "http://localhost/",
        },
      },
      setupFiles: "./src/setupTests.ts",
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
      },
    },
  };
});
