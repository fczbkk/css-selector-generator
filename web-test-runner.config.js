import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: ["test/**/*.spec.ts"],
  plugins: [esbuildPlugin({ ts: true })],
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: "chromium" })],
  testFramework: {
    config: {
      ui: "bdd",
      timeout: "2000",
    },
  },
};
