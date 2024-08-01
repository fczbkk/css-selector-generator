import { test, expect } from "./fixtures.js";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import * as path from "node:path";
import type { getCssSelector } from "../src/index.js";

const __dirname = new URL(".", import.meta.url).pathname;

declare global {
  interface CssSelectorGenerator {
    getCssSelector: typeof getCssSelector;
  }
  const CssSelectorGenerator: CssSelectorGenerator;
}

test("complex test", async ({ libraryPage }) => {
  const contentPath = path.resolve(__dirname, "../test/html/complex.html");
  const content = await readFile(contentPath, "utf8");
  await libraryPage.setContent(content);

  const foundErrors = await libraryPage.page.evaluate(() => {
    const allElements = document.querySelectorAll("*");
    const errors: { selector: string; element: Element }[] = [];
    Array.from(allElements).forEach((element) => {
      const selector = CssSelectorGenerator.getCssSelector(element);
      const matches = document.querySelectorAll(selector);
      if (matches.length !== 1 && matches[1] !== element) {
        errors.push({ selector, element });
      }
    });

    return errors;
  });

  expect(foundErrors).toEqual([]);
});
