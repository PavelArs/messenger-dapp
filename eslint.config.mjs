// @ts-check

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';


export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    eslintPluginPrettierRecommended
    ],
});
