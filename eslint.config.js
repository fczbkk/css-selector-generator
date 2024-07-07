import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["build/", "types/", "temp/", "esm/"],
  },
  eslint.configs.recommended,
  prettierConfig,
  {
    rules: {
      "no-console": "warn",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
];
