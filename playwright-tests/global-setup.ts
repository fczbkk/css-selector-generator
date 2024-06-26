import { FullConfig } from "@playwright/test";
import { promises as fs } from "node:fs";
import { LIB_BUILD_DIR, LIB_BUILD_PATH, LIB_SRC_PATH } from "./constants.js";
import { buildScript } from "./utilities.js";

const __dirname = new URL(".", import.meta.url).pathname;

async function buildLib() {
  console.time("build lib");
  await fs.mkdir(LIB_BUILD_DIR, { recursive: true });
  await buildScript({
    srcPath: LIB_SRC_PATH,
    buildPath: LIB_BUILD_PATH,
    globalName: "CssSelectorGenerator",
  });
  console.timeEnd("build lib");
}

async function globalSetup(config: FullConfig) {
  await buildLib();
}

export default globalSetup;
