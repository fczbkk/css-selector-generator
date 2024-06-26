import type { Page } from "@playwright/test";

export class BlankPage {
  constructor(public readonly page: Page) {}

  async setContent(content: string) {
    await this.page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
      <body>${content}</body>
    </html>
  `);
  }

  async body() {
    return this.page.locator("body");
  }

  async document(): Promise<Document> {
    return this.page.evaluate("document");
  }

  async window() {
    return this.page.evaluate("window");
  }
}
