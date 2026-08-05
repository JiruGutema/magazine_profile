import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Resolves the `@/*` alias straight from tsconfig.json.
    tsconfigPaths: true,
  },
  // tsconfig sets `jsx: "preserve"` for Next's own compiler, so the test
  // transform has to be told to actually emit JSX calls.
  oxc: {
    jsx: { runtime: "automatic" },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["lib/**/*.ts", "app/api/**/*.ts"],
      exclude: [
        "lib/generated/**",
        // Thin wiring or pure data with no branches worth asserting.
        "lib/prisma.ts",
        "lib/types.ts",
        "lib/content-types.ts",
        "lib/content-defaults.ts",
        // Browser-only module exercised through jsdom, not measured here.
        "lib/client-fingerprint.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
