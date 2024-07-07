/* eslint-disable no-console */

import { type Browser, chromium, type Page } from "playwright";
import chalk from "chalk";
import { URL } from "node:url";
import * as path from "node:path";
import { readFile } from "node:fs/promises";
import {
  buildScript,
  BuildScriptProps,
  consoleMessageToTerminal,
} from "../playwright-tests/utilities";
import { glob } from "glob";
import * as Mocha from "mocha";

type OnRunnerEnd = (errors: Error[]) => void;

const __dirname = new URL(".", import.meta.url).pathname;
const rootDir = path.resolve(__dirname, "..");
const tempDir = path.resolve(rootDir, "temp");

async function getAllTestFiles(dir: string = rootDir) {
  return glob("**/*.spec.ts", {
    cwd: dir,
    ignore: ["**/node_modules/**", "**/playwright-tests/**"],
  });
}

async function buildAndInsertScript(props: BuildScriptProps & { page: Page }) {
  const { buildPath, page } = props;
  await buildScript(props);
  return await page.addScriptTag({ path: buildPath });
}

async function setupMochaPage(page: Page) {
  const styleFile = path.resolve(__dirname, "../node_modules/mocha/mocha.css");
  const style = await readFile(styleFile, "utf-8");

  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>mock page</title>
        <style>${style}</style>
      </head>
      <body>
        <div id="mocha"></div>
      </body>
    </html>
  `);

  await buildAndInsertScript({
    srcPath: path.resolve(__dirname, "../node_modules/mocha/mocha.js"),
    buildPath: path.resolve(tempDir, "mocha.js"),
    globalName: "mocha",
    page,
  });

  await page.addScriptTag({
    content: `
        mocha.setup("bdd");
        mocha.checkLeaks();
      `,
  });
}

async function runMochaTests(testFile: string, page: Page) {
  await buildAndInsertScript({
    srcPath: path.resolve(rootDir, testFile),
    buildPath: path.resolve(tempDir, testFile.replace(".ts", ".js")),
    globalName: `runTests`,
    page,
  });

  await page.addScriptTag({
    content: `
      const runner = mocha.run();
      runner.eventNames().forEach(event => {
        runner.on(event, (...args) => {
          window.mochaEvent(event, ...args)
        });
      });
    `,
  });
}

async function setupMochaRunner({
  page,
  testFile,
  onRunnerEnd,
}: {
  page: Page;
  testFile: string;
  onRunnerEnd: OnRunnerEnd;
}) {
  // Create a new Mocha runner and reporter
  const suite = new Mocha.Suite(testFile);
  const runner = new Mocha.Runner(suite);

  const failedTests: Error[] = [];
  runner.on("fail", (test) => {
    failedTests.push(test.err);
  });

  runner.on("end", () => {
    onRunnerEnd(failedTests);
  });

  // TODO figure out why the diff option is not working. We are not receiving "expected" and "actual" properties from the browser.
  new Mocha.reporters.List(runner, {
    diff: true,
  });

  // Expose a function to send events from the browser to Node.js
  await page.exposeFunction("mochaEvent", (event: string, ...args) => {
    // We are just passing the event and the arguments from the Mocha runner in the browser to the Mocha runner outside of browser.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    runner.emit(event, ...args);
  });
}

async function setupMochaAndRunTests({
  page,
  testFile,
  onRunnerEnd,
}: {
  page: Page;
  testFile: string;
  onRunnerEnd: OnRunnerEnd;
}) {
  await setupMochaRunner({ page, testFile, onRunnerEnd });
  await setupMochaPage(page);
  await runMochaTests(testFile, page);
}

async function runSingleTest(testFile: string, browser: Browser) {
  console.log(`running tests from: ${chalk.bold(testFile)}`);

  const page = await browser.newPage();
  page.on("console", consoleMessageToTerminal);

  return new Promise<Error[]>((resolve) => {
    const onRunnerEnd = (errors: Error[]) => {
      void page.close().then(() => {
        resolve(errors);
      });
    };

    void setupMochaAndRunTests({ page, testFile, onRunnerEnd });
  });
}

async function runTests() {
  const startTimestamp = Date.now();
  console.log(`${chalk.bold("START")} Run all tests`);

  const browser = await chromium.launch({ headless: true });
  const testFiles = await getAllTestFiles();

  const allFailedTests: Error[] = [];

  for (const testFile of testFiles) {
    const failedTests = await runSingleTest(testFile, browser);
    allFailedTests.push(...failedTests);
  }

  await browser.close();

  const endTimestamp = Date.now();
  console.log(
    `${chalk.bold("END")} Run all tests (${String(endTimestamp - startTimestamp)}ms)`,
  );

  return allFailedTests;
}

function showErrors(errors: Error[]) {
  for (const error of errors) {
    console.error(error);
  }
}

const foundErrors = await runTests();
if (foundErrors.length > 0) {
  showErrors(foundErrors);
}
process.exit(foundErrors.length > 0 ? 1 : 0);
