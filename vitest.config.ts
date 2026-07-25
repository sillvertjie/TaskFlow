import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "next/headers": path.resolve(
        __dirname,
        "lib/api/__tests__/mocks/next-headers.ts",
      ),
    },
  },

  test: {
    environment: "node",
  },
});
