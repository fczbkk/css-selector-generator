import type { BuildOptions } from "esbuild";
import { build } from "esbuild";
import { ConsoleMessage, Page } from "playwright";

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

/**
 * Transfers Playwright's console message object to terminal.
 */
export async function consoleMessageToTerminal(consoleMessage: ConsoleMessage) {
  const consoleMessageMethods: Record<string, string> = {
    warning: "warn",
    startGroup: "group",
    startGroupCollapsed: "groupCollapsed",
    endGroup: "groupEnd",
  };

  const type = consoleMessage.type();
  const method = consoleMessageMethods[type] ?? type;
  const msgArgs = consoleMessage.args();
  const logValues = await Promise.all(
    // We are just passing arguments to console.log, we don't care about their types.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    msgArgs.map(async (arg) => await arg.jsonValue()),
  );
  // eslint-disable-next-line no-console,@typescript-eslint/no-unsafe-call
  console[method](...logValues);
}
