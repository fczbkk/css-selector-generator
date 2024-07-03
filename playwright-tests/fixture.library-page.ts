import type { Page } from "@playwright/test";
import { buildAndInsertScript } from "./utilities.js";
import * as path from "node:path";
import { URL } from "node:url";

const __dirname = new URL(".", import.meta.url).pathname;

export class LibraryPage {
  constructor(public readonly page: Page) {}

  async setContent(content: string) {
    await this.page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
      <body>${content}</body>
    </html>
  `);

    // inject the library
    await buildAndInsertScript(
      {
        srcPath: path.resolve(__dirname, "../src/index.ts"),
        buildPath: path.resolve(__dirname, "../temp/test/index.js"),
        globalName: "CssSelectorGenerator",
      },
      this.page,
    );
  }
}
