import { test as base } from "@playwright/test";
import { LibraryPage } from "./fixture.library-page.js";

interface Fixtures {
  libraryPage: LibraryPage;
}

export const test = base.extend<Fixtures>({
  libraryPage: async ({ page }, use) => {
    const libraryPage = new LibraryPage(page);
    await use(libraryPage);
  },
});

export { expect } from "@playwright/test";
