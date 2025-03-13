// @ts-check

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.ts"],
  ignores: [
    "**/artifacts/**",
    "**/cache/**",
    "**/contracts/**",
    "**/node_modules/**",
    "**/typechain-types/**",
  ],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
  ],
});
