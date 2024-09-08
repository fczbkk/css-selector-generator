import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  nodeResolve: true,
  files: ["**/*.spec.ts", "!playwright-tests"],
  plugins: [esbuildPlugin({ ts: true })],
};
