import { URL } from "node:url";
import { resolve } from "node:path";
import { build } from "esbuild";

import { chromium } from "playwright";

const __dirname = new URL(".", import.meta.url).pathname;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// test utilities
await buildAndInsertScript({
  srcPath: resolve(__dirname, "./test-utilities.ts"),
  buildPath: resolve(__dirname, "../temp/scenarios/test-utilities.js"),
  globalName: "testUtilities",
});

// library
await buildAndInsertScript({
  srcPath: resolve(__dirname, "../src/index.ts"),
  buildPath: resolve(__dirname, "../temp/scenarios/index.js"),
  globalName: "CssSelectorGenerator",
});

const scenario = `
  <div class="aaa bbb">
    <!-- name: needle -->
  </div>
  <div class="aaa"></div>
  <div class="bbb"></div>
`;

await page.setContent(scenario);

const selector = await page.evaluate(() => {
  // @ts-ignore -- TS does not know that we added the library to the page's global scope
  const scenarioData = window.testUtilities.getScenarioData(document.body);
  // const element = document.querySelector("p");
  // @ts-ignore -- TS does not know that we added the library to the page's global scope
  return window.CssSelectorGenerator.getCssSelector(
    scenarioData.element.needle,
  );
});

console.log("selector", selector);

await browser.close();

interface BuildScriptProps {
  srcPath: string;
  buildPath: string;
  globalName: string;
}

async function buildAndInsertScript(props: BuildScriptProps) {
  const { buildPath } = props;
  await buildScript(props);
  return await page.addScriptTag({ path: buildPath });
}

async function buildScript({
  srcPath,
  buildPath,
  globalName,
}: BuildScriptProps) {
  return await build({
    entryPoints: [srcPath],
    outfile: buildPath,
    bundle: true,
    format: "iife",
    globalName: globalName,
    platform: "browser",
  });
}
