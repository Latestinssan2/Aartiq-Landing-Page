import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // This repo had no working lint command until now — `next lint` was removed in
    // Next 16, so these rules had never been run over the tree. Turning them on
    // surfaced 114 pre-existing errors (plus ~380 warnings, almost all unused-vars).
    // They are baselined as warnings so `npm run lint` is green and CI catches
    // newly introduced violations. This is debt to burn down deliberately, not a
    // decision that these rules do not matter: counts below are as of adoption.
    rules: {
      "react/no-unescaped-entities": "warn", // 69
      "@typescript-eslint/no-explicit-any": "warn", // 35
      "react-hooks/set-state-in-effect": "warn", // 5
      "prefer-const": "warn", // 2
      "react-hooks/immutability": "warn", // 1
      "react-hooks/static-components": "warn", // 1
      "@next/next/no-sync-scripts": "warn", // 1
    },
  },
]);

export default eslintConfig;
