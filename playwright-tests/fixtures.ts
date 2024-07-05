import { test as base } from "@playwright/test";
import { BlankPage } from "./fixture.blank-page.js";
import { LibraryPage } from "./fixture.library-page.js";

interface Fixtures {
  blankPage: BlankPage;
  libraryPage: LibraryPage;
}

export const test = base.extend<Fixtures>({
  blankPage: async ({ page }, use) => {
    const blankPage = new BlankPage(page);
    await use(blankPage);
  },
  libraryPage: async ({ page }, use) => {
    const libraryPage = new LibraryPage(page);
    await use(libraryPage);
  },
});

export { expect } from "@playwright/test";
