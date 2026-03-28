import { assert } from "chai";
import {
  getClassSelectors,
  getElementClassSelectors,
} from "../src/selector-class.js";
import { CssSelectorGenerated } from "../src/types";
import { DEFAULT_OPTIONS } from "../src/utilities-options.js";

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

  describe("ignoreGeneratedClassNames option", () => {
    it("should include generated classes by default", () => {
      root.innerHTML = '<div class="button css-abc123 navbar"></div>';
      const result = getElementClassSelectors(root.firstElementChild);
      assert.lengthOf(result, 3);
      assert.include(result, ".button" as CssSelectorGenerated);
      assert.include(result, ".css-abc123" as CssSelectorGenerated);
      assert.include(result, ".navbar" as CssSelectorGenerated);
    });

    it("should filter generated classes when option is enabled", () => {
      root.innerHTML = '<div class="button css-abc123 navbar"></div>';
      const result = getElementClassSelectors(root.firstElementChild, {
        ...DEFAULT_OPTIONS,
        ignoreGeneratedClassNames: true,
      });
      assert.lengthOf(result, 2);
      assert.include(result, ".button" as CssSelectorGenerated);
      assert.include(result, ".navbar" as CssSelectorGenerated);
      assert.notInclude(result, ".css-abc123" as CssSelectorGenerated);
    });

    it("should handle all classes being filtered out", () => {
      root.innerHTML = '<div class="abc xyz css-123"></div>';
      const result = getElementClassSelectors(root.firstElementChild, {
        ...DEFAULT_OPTIONS,
        ignoreGeneratedClassNames: true,
      });
      // All are rejected: "abc" and "xyz" are too short (< 4 chars), "css-123" has numbers
      assert.lengthOf(result, 0);
    });

    it("should work with getClassSelectors for multiple elements", () => {
      root.innerHTML = `
        <div class="button css-123abc navbar"></div>
        <div class="button css-456def navbar"></div>
      `;
      const result = getClassSelectors([...root.querySelectorAll("div")], {
        ...DEFAULT_OPTIONS,
        ignoreGeneratedClassNames: true,
      });
      assert.lengthOf(result, 2);
      assert.include(result, ".button" as CssSelectorGenerated);
      assert.include(result, ".navbar" as CssSelectorGenerated);
      assert.notInclude(result, ".css-123abc" as CssSelectorGenerated);
      assert.notInclude(result, ".css-456def" as CssSelectorGenerated);
    });

    it("should filter styled-components patterns", () => {
      root.innerHTML = '<div class="sc-bdVaJa button-primary"></div>';
      const result = getElementClassSelectors(root.firstElementChild, {
        ...DEFAULT_OPTIONS,
        ignoreGeneratedClassNames: true,
      });
      assert.lengthOf(result, 1);
      assert.include(result, ".button-primary" as CssSelectorGenerated);
      assert.notInclude(result, ".sc-bdVaJa" as CssSelectorGenerated);
    });

    it("should filter MUI/makeStyles patterns", () => {
      root.innerHTML = '<div class="makeStyles-root-123 nav-container"></div>';
      const result = getElementClassSelectors(root.firstElementChild, {
        ...DEFAULT_OPTIONS,
        ignoreGeneratedClassNames: true,
      });
      assert.lengthOf(result, 1);
      assert.include(result, ".nav-container" as CssSelectorGenerated);
      assert.notInclude(
        result,
        ".makeStyles-root-123" as CssSelectorGenerated,
      );
    });

    it("should accept BEM notation", () => {
      root.innerHTML =
        '<div class="block__element--modifier css-abc123"></div>';
      const result = getElementClassSelectors(root.firstElementChild, {
        ...DEFAULT_OPTIONS,
        ignoreGeneratedClassNames: true,
      });
      assert.lengthOf(result, 1);
      assert.include(result, ".block__element--modifier" as CssSelectorGenerated);
      assert.notInclude(result, ".css-abc123" as CssSelectorGenerated);
    });

    it("should handle camelCase class names", () => {
      root.innerHTML = '<div class="navButton css-xyz123 mainContainer"></div>';
      const result = getElementClassSelectors(root.firstElementChild, {
        ...DEFAULT_OPTIONS,
        ignoreGeneratedClassNames: true,
      });
      assert.lengthOf(result, 2);
      assert.include(result, ".navButton" as CssSelectorGenerated);
      assert.include(result, ".mainContainer" as CssSelectorGenerated);
      assert.notInclude(result, ".css-xyz123" as CssSelectorGenerated);
    });
  });
});
