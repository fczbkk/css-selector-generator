import { assert } from "chai";
import { getCssSelector } from "../src";

describe("options: combineBetweenSelectors", function () {
  let root: Element;
  const html_non_unique_class_and_tag =
    '<p class="aaa"></p>' + "<p></p>" + '<div class="aaa"></div>';

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should combine selectors when enabled", function () {
    root.innerHTML = html_non_unique_class_and_tag;
    const result = getCssSelector(root.firstElementChild, {
      combineBetweenSelectors: true,
    });
    assert.equal(result, "p.aaa");
  });

  it("should not combine selectors when disabled", function () {
    root.innerHTML = html_non_unique_class_and_tag;
    const result = getCssSelector(root.firstElementChild, {
      combineBetweenSelectors: false,
    });
    assert.notEqual(result, "p.aaa");
  });
});
