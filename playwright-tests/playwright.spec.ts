import { test, expect } from "./fixtures.js";
import { sanitizeRoot } from "../src/utilities-options.js";

test("selector test", async ({ blankPage }) => {
  await blankPage.setContent("ahoj");
  const body = await blankPage.body();
  await expect(body).toHaveText("ahoj");
});

test("sanitize root", async ({ blankPage }) => {
  await blankPage.page.exposeBinding("sanitizeRoot", sanitizeRoot);
  const result = await blankPage.page.evaluate(() => {
    const element = document.body.appendChild(document.createElement("div"));
    return sanitizeRoot(document, element);
  });

  console.log("result", result);
  expect(true).toBe(false);

  /*
    const element = root.appendChild(document.createElement("div"));
    const result = sanitizeRoot(document, element);
    assert.equal(result, document);

   */
});
