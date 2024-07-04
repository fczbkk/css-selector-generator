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

const __dirname = new URL(".", import.meta.url).pathname;
const rootDir = path.resolve(__dirname, "..");
const tempDir = path.resolve(rootDir, "temp");

async function getAllTestFiles(dir: string = rootDir) {
  return glob("**/*.spec.ts", {
    cwd: dir,
    ignore: ["**/node_modules/**", "**/playwright-tests/**"],
  });
}

async function buildAndInsertScript(props: BuildScriptProps, page: Page) {
  const { buildPath } = props;
  await buildScript(props);
  return await page.addScriptTag({ path: buildPath });
}

async function runSingleTest(testFile: string, browser: Browser) {
  return new Promise<Error[]>(async (resolve) => {
    const startTimestamp = Date.now();
    process.stdout.write(`running tests from: ${chalk.bold(testFile)}...`);
    const page = await browser.newPage();

    page.on("console", consoleMessageToTerminal);

    // Create a new Mocha runner and reporter
    const suite = new Mocha.Suite(testFile);
    const runner = new Mocha.Runner(suite);

    const failedTests: Error[] = [];
    runner.on("fail", (test) => {
      failedTests.push(test.err);
    });

    runner.on("end", async () => {
      await page.close();
      resolve(failedTests);
    });

    // TODO figure out why the diff option is not working. We are not receiving "expected" and "actual" properties from the browser.
    new Mocha.reporters.List(runner, {
      diff: true,
    });

    // Expose a function to send events from the browser to Node.js
    await page.exposeFunction("mochaEvent", (event, ...args) => {
      runner.emit(event, ...args);
    });

    const styleFile = path.resolve(
      __dirname,
      "../node_modules/mocha/mocha.css",
    );
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

    await buildAndInsertScript(
      {
        srcPath: path.resolve(__dirname, "../node_modules/mocha/mocha.js"),
        buildPath: path.resolve(tempDir, "mocha.js"),
        globalName: "mocha",
      },
      page,
    );

    await page.addScriptTag({
      content: `
        mocha.setup("bdd");
        mocha.checkLeaks();
      `,
    });

    await buildAndInsertScript(
      {
        srcPath: path.resolve(rootDir, testFile),
        buildPath: path.resolve(tempDir, testFile.replace(".ts", ".js")),
        globalName: `runTests`,
      },
      page,
    );

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

    const endTimestamp = Date.now();
    process.stdout.write(
      `${chalk.green(" DONE")} (${endTimestamp - startTimestamp}ms)\n`,
    );
  });
}

async function runTests() {
  const startTimestamp = Date.now();
  process.stdout.write(`${chalk.bold("START")} Run all tests\n`);

  const browser = await chromium.launch({ headless: true });
  const testFiles = await getAllTestFiles();

  const allFailedTests: Error[] = [];

  for (const testFile of testFiles) {
    const failedTests = await runSingleTest(testFile, browser);
    allFailedTests.push(...failedTests);
  }

  await browser.close();

  const endTimestamp = Date.now();
  process.stdout.write(
    `${chalk.bold("END")} Run all tests (${endTimestamp - startTimestamp}ms)\n`,
  );

  return allFailedTests;
}

function showErrors(errors: Error[]) {
  for (const error of errors) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

const foundErrors = await runTests();
if (foundErrors.length > 0) {
  showErrors(foundErrors);
}
process.exit(foundErrors.length > 0 ? 1 : 0);
