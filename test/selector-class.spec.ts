import { assert } from "chai";
import { getClassSelectors } from "../src/selector-class.js";
import { CssSelectorGenerated } from "../src/types";

describe("selector - class", function () {
  let root: Element;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should generate class selectors", function () {
    root.innerHTML = '<div class="aaa bbb ccc"></div>';
    const result = getClassSelectors([root.firstElementChild]);
    assert.lengthOf(result, 3);
    assert.include(result, ".aaa" as CssSelectorGenerated);
    assert.include(result, ".bbb" as CssSelectorGenerated);
    assert.include(result, ".ccc" as CssSelectorGenerated);
  });

  it("should return empty list if not set", function () {
    root.innerHTML = "<div></div>";
    const result = getClassSelectors([root.firstElementChild]);
    assert.lengthOf(result, 0);
  });

  it("should ignore unnecessary whitespace", function () {
    root.innerHTML = '<div class="   aaa   bbb   ccc   "></div>';
    const result = getClassSelectors([root.firstElementChild]);
    assert.lengthOf(result, 3);
    assert.include(result, ".aaa" as CssSelectorGenerated);
    assert.include(result, ".bbb" as CssSelectorGenerated);
    assert.include(result, ".ccc" as CssSelectorGenerated);
  });

  it("should ignore empty class name", function () {
    root.innerHTML = '<div class=""></div>';
    const result = getClassSelectors([root.firstElementChild]);
    assert.lengthOf(result, 0);
  });

  it("should ignore class name full of whitespace", function () {
    root.innerHTML = '<div class="   "></div>';
    const result = getClassSelectors([root.firstElementChild]);
    assert.lengthOf(result, 0);
  });

  it("should sanitize class name", function () {
    root.innerHTML = '<div class="aaa:bbb"></div>';
    const result = getClassSelectors([root.firstElementChild]);
    const expectation = ".aaa\\:bbb" as CssSelectorGenerated;
    assert.lengthOf(result, 1);
    assert.include(result, expectation);
  });

  it("should escape class names that start with a number", function () {
    root.innerHTML = '<div class="1 1a a1"></div>';
    const result = getClassSelectors([root.firstElementChild]);
    assert.sameMembers(result, [".\\31 ", ".\\31 a", ".a1"]);
  });

  it("should generate class selectors for multiple elements", () => {
    root.innerHTML = `
      <div class="aaa bbb"></div>
      <div class="bbb ccc"></div>
    `;
    const result = getClassSelectors([...root.querySelectorAll("div")]);
    assert.sameMembers(result, [".bbb"]);
  });
});
