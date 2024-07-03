import type { BuildOptions } from "esbuild";
import { build } from "esbuild";
import { Page } from "playwright";

export interface BuildScriptProps {
  srcPath: string;
  buildPath: string;
  globalName: string;
  buildOptions?: BuildOptions;
}

// Uses EsBuild, builds a single file script optimized to be injected into the browser environment.
export async function buildScript({
  srcPath,
  buildPath,
  globalName,
  buildOptions = {},
}: BuildScriptProps) {
  // TODO add caching support to prevent unnecessary rebuilds
  return await build({
    entryPoints: [srcPath],
    outfile: buildPath,
    bundle: true,
    format: "iife",
    globalName: globalName,
    platform: "browser",
    ...buildOptions,
  });
}

export async function buildAndInsertScript(
  props: BuildScriptProps,
  page: Page,
) {
  const { buildPath } = props;
  await buildScript(props);
  return await page.addScriptTag({ path: buildPath });
}
