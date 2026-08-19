import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "public/mockServiceWorker.js"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Vitest config + tests: node globals, relaxed type-checking for test ergonomics
    files: ["vitest.config.ts", "src/**/*.test.{ts,tsx}", "src/test/**"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parserOptions: {
        project: ["./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // fire-and-forget timers/promises are the norm in tests
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/unbound-method": "off",
    },
  },
  {
    // Teaching snippets: some canonical patterns intentionally violate modern rules.
    // Each exception below is a snippet design decision, documented in the file.
    files: [
      "src/hooks/usePrevious.ts",
      "src/components/RenderCount.tsx",
    ],
    rules: {
      // usePrevious/RenderCount MUST read refs during render — that IS the lesson.
      "react-hooks/refs": "off",
    },
  },
  {
    // AuthContext.tsx pairs a component with its hook by design (co-located API).
    files: ["src/context/AuthContext.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // Booting MSW then rendering — the promise is intentionally top-level.
    files: ["src/main.tsx"],
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
  {
    // Event-handler async thunks: errors are handled inside; void marks intent.
    files: ["src/pages/**/*.tsx", "src/components/NavBar.tsx"],
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
]);
