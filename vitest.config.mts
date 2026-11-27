import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Nothing here touches window or document, so a single node project is enough; jsdom would
    // only slow the run down.
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["__tests__/**/*.test.ts"],
        },
      },
    ],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts"],
      // Type-only files have no behaviour; the logic-free barrel is measured by index.test.ts.
      exclude: ["lib/index.ts", "lib/types/**"],
      thresholds: { 100: true },
    },
  },
});
