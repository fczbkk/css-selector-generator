import { assert } from "chai";
import { getCssSelector } from "../src";

describe("options: combineWithinSelector", function () {
  let root: Element;
  const html_combined_classnames =
    '<div class="aaa bbb"></div>' +
    '<div class="aaa"></div>' +
    '<div class="bbb"></div>';

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should combine selectors when enabled", function () {
    root.innerHTML = html_combined_classnames;
    const result = getCssSelector(root.firstElementChild, {
      combineWithinSelector: true,
    });
    assert.equal(result, ".aaa.bbb");
  });

  it("should not combine selectors when disabled", function () {
    root.innerHTML = html_combined_classnames;
    const result = getCssSelector(root.firstElementChild, {
      combineWithinSelector: false,
    });
    assert.notEqual(result, ".aaa.bbb");
    assert.notEqual(result, ".bbb.aaa");
  });
});
