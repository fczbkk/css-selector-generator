import { getCssSelector } from "../src/index.ts";
import { assert } from "chai";

describe("options: includeTag", function () {
  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should prefix tag to each selector", function () {
    root.innerHTML = '<div class="aaa bbb"><div class="aaa"></div></div>';
    const result = getCssSelector(root.firstElementChild.firstChild, {
      includeTag: true,
      selectors: ["class"],
    });
    assert.equal(result, "div.bbb div.aaa");
  });
});
