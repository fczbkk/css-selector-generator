/* eslint no-console: 0 */

import { URL } from "node:url";
import { resolve, extname } from "node:path";
import { build } from "esbuild";
import { readdir, readFile } from "node:fs/promises";
import type { Dirent } from "node:fs";
import chalk from "chalk";

import { chromium } from "playwright";
import type { Page } from "playwright";
import { parseAllComments, ScenarioExpectations } from "./scenario-utilities";

// TODO: temporary hack until Typescript learns that Dirent has a "path" property
type DirentWithPath = Dirent & { path: string };

interface ScenarioTestResultItem {
  key: string;
  expectation: string;
  selector: string;
}

interface ScenarioTestResult {
  success: ScenarioTestResultItem[];
  error: ScenarioTestResultItem[];
}

const __dirname = new URL(".", import.meta.url).pathname;
const scenariosDir = resolve(__dirname, "../scenario");

function isHtmlFile(dirent: Dirent) {
  return dirent.isFile() && extname(dirent.name) === ".html";
}

async function getTestEnvironment() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // inject test utilities
  await buildAndInsertScript(
    {
      srcPath: resolve(__dirname, "./scenario-utilities.ts"),
      buildPath: resolve(__dirname, "../temp/scenarios/scenario-utilities.js"),
      globalName: "scenarioUtilities",
    },
    page,
  );

  // inject the library
  await buildAndInsertScript(
    {
      srcPath: resolve(__dirname, "../src/index.ts"),
      buildPath: resolve(__dirname, "../temp/scenarios/index.js"),
      globalName: "CssSelectorGenerator",
    },
    page,
  );

  return { page, browser };
}

async function testScenario(
  scenarioContent: string,
  page: Page,
): Promise<ScenarioTestResult> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>${scenarioContent}</body>
    </html>
  `);

  return page.evaluate(() => {
    const scenarioExpectations: ScenarioExpectations =
      // @ts-ignore -- TS does not know that we added the library to the page's global scope
      window.scenarioUtilities.parseAllComments(document.body);

    console.log("scenarioExpectations", scenarioExpectations);

    const result: ScenarioTestResult = { success: [], error: [] };
    scenarioExpectations.forEach((targetElements, expectedSelector) => {
      const elements = Array.from(targetElements);
      // @ts-ignore -- TS does not know that we added the library to the page's global scope
      const generatedSelector = window.CssSelectorGenerator.getCssSelector(
        elements.length === 1 ? elements[0] : elements,
      );
      result[expectedSelector === generatedSelector ? "success" : "error"].push(
        {
          expectation: expectedSelector,
          selector: generatedSelector,
          key: expectedSelector,
        },
      );
    });

    return result;
  });
}

interface BuildScriptProps {
  srcPath: string;
  buildPath: string;
  globalName: string;
}

async function buildAndInsertScript(props: BuildScriptProps, page: Page) {
  const { buildPath } = props;
  await buildScript(props);
  return await page.addScriptTag({ path: buildPath });
}

// Uses EsBuild, builds a single file script optimized to be injected into the browser environment.
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

async function getScenariosFiles() {
  return (await readdir(scenariosDir, { withFileTypes: true }))
    .filter(isHtmlFile)
    .map(({ name, path }: DirentWithPath) => resolve(path, name));
}

async function testAllScenarios() {
  // TODO try to use Assert node module for the reporting
  const { page, browser } = await getTestEnvironment();

  const scenarioErrors: Record<string, ScenarioTestResultItem[]> = {};

  const scenarioFiles = await getScenariosFiles();

  for (const scenarioFile of scenarioFiles) {
    const scenarioContent = await readFile(scenarioFile, "utf-8");
    const scenarioData = await testScenario(scenarioContent, page);
    const { error } = scenarioData;

    if (error.length > 0) {
      scenarioErrors[scenarioFile] = scenarioData.error;
      console.log(`${chalk.red.bold("✗")} ${chalk.red(scenarioFile)}`);
    } else {
      console.log(`${chalk.green.bold("✓")} ${chalk.green(scenarioFile)}`);
    }
  }

  const hasErrors = Object.keys(scenarioErrors).length > 0;

  if (hasErrors) {
    console.log("\nFOUND ERRORS\n");

    for (const [filePath, errors] of Object.entries(scenarioErrors)) {
      console.log(filePath);
      errors.forEach(({ key, expectation, selector }) => {
        console.log(` - ${key}`);
        console.log(`      found: ${chalk.bold.red(selector)}`);
        console.log(`   expected: ${chalk.bold(expectation)}`);
      });
    }
  }

  await browser.close();
  return hasErrors;
}

const hasErrors = await testAllScenarios();
process.exit(hasErrors ? 1 : 0);
