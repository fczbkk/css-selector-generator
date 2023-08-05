import { URL } from "node:url";
import { resolve, extname } from "node:path";
import { build } from "esbuild";
import { readdir, readFile } from "node:fs/promises";
import type { Dirent } from "node:fs";
import { equal } from "node:assert";

import { chromium } from "playwright";
import type { Page } from "playwright";
import { ScenarioData } from "./test-utilities.js";

interface ScenarioTestResult {
  [key: string]: { expectation: string; selector: string };
}

// TODO collect all results and report them, throw an error if any of them fail

const __dirname = new URL(".", import.meta.url).pathname;
const scenariosDir = resolve(__dirname, "../scenario");

function isHtmlFile(dirent: Dirent) {
  return dirent.isFile() && extname(dirent.name) === ".html";
}

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

async function testScenario(
  scenarioContent: string,
  page: Page,
): Promise<ScenarioTestResult> {
  await page.setContent(scenarioContent);

  return page.evaluate(() => {
    // @ts-ignore -- TS does not know that we added the library to the page's global scope
    const scenarioData: ScenarioData = window.testUtilities.getScenarioData(
      document.body,
    );

    const result: ScenarioTestResult = {};
    for (const [key, expectation] of Object.entries(scenarioData.expectation)) {
      // @ts-ignore -- TS does not know that we added the library to the page's global scope
      const selector = window.CssSelectorGenerator.getCssSelector(
        scenarioData.element[key],
      );
      result[key] = { expectation, selector };
    }

    return result;
  });
}

const scenarioFiles = (await readdir(scenariosDir, { withFileTypes: true }))
  .filter(isHtmlFile)
  .map(({ name, path }) => resolve(path, name));

for (const scenarioFile of scenarioFiles) {
  const scenarioContent = await readFile(scenarioFile, "utf-8");
  const scenarioData = await testScenario(scenarioContent, page);
  // TODO handle results
  // console.log(scenarioData);
}

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
