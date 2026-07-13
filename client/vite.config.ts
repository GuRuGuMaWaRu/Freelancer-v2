import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Keep in sync with server/.env.example PORT and client/.env.development VITE_API_PORT.
const DEFAULT_API_PORT = "4000";
const DEFAULT_DEV_PORT = 3000;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = env.VITE_API_PORT || DEFAULT_API_PORT;
  const devPort = Number(env.VITE_PORT) || DEFAULT_DEV_PORT;

  return {
    plugins: [react(), tsconfigPaths()],
    optimizeDeps: {
      include: ["@pet-freelancer/shared", "zod"],
    },
    server: {
      port: devPort,
      strictPort: false,
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
