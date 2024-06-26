import { URL } from "node:url";
import { resolve } from "node:path";

const __dirname = new URL(".", import.meta.url).pathname;

export const TEMP_DIR = resolve(__dirname, "../temp");
export const LIB_SRC_PATH = resolve(__dirname, "../src/index.ts");
export const LIB_BUILD_DIR = resolve(TEMP_DIR, "lib");
export const LIB_BUILD_PATH = resolve(LIB_BUILD_DIR, "index.js");
