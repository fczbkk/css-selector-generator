import { assert } from "chai";
import { parseTestHtml } from "./test-utilities.js";

describe("test utilities", () => {
  it("should parse single element", function () {
    const html = `<div><!-- name: needle --></div>`;
    const data = parseTestHtml(html);
    assert.property(data.element, "needle");
  });
  it("should parse group of elements", function () {
    const html = `
      <div><!-- group: needle --></div>
      <div><!-- group: needle --></div>
    `;
    const data = parseTestHtml(html);
    assert.property(data.group, "needle");
  });
  it("should parse expected selectors", function () {
    const html = `
      <div><!-- name: needle --></div>  
      <!-- expect: needle;div -->
    `;
    const data = parseTestHtml(html);
    assert.propertyVal(data.expectation, "needle", "div");
  });
});
