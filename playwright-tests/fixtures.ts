import { test as base } from "@playwright/test";
import { BlankPage } from "./fixture.blank-page.js";

type Fixtures = {
  blankPage: BlankPage;
};

export const test = base.extend<Fixtures>({
  blankPage: async ({ page }, use) => {
    const blankPage = new BlankPage(page);
    await use(blankPage);
  },
});

export { expect } from "@playwright/test";
