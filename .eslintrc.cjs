module.exports = {
  extends: "prettier",
  parserOptions: {
    sourceType: "module",
  },
  env: {
    es6: true,
    browser: true,
  },
  rules: {
    "no-console": "warn",
  },
  overrides: [
    {
      files: ["src/**/*.ts", "test/**/*.ts"],
      extends: ["prettier"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      rules: {
        "no-console": "warn",
      },
    },
  ],
  root: true,
};
