import { assert } from "chai";
import { getCssSelector, cssSelectorGenerator } from "../src";

describe("CssSelectorGenerator", function () {
  let root: Element;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  describe("basic scenarios", function () {
    it("should take root element into account", () => {
      root.innerHTML = `
      <span></span>
      <div>
        <span></span>
      </div>
    `;
      const haystack = root.querySelector("div");
      const needle = haystack.querySelector("span");
      const result = getCssSelector(needle, { root: haystack });
      assert.equal(result, "span");
    });
  });

  describe("special scenarios", function () {
    it("should not crash on parent-less element", function () {
      const element = document.createElement("div");
      const fn = () => getCssSelector(element);
      assert.doesNotThrow(fn);
    });

    it("should not throw on descendant selector within root", () => {
      root.innerHTML = "<div><span></span><span></span></div>";
      const selectorTarget = root.querySelector("div span");
      const selectorRoot = root.querySelector("div");
      const fn = () => getCssSelector(selectorTarget, { root: selectorRoot });
      assert.doesNotThrow(fn);
    });

    it("should not timeout on element producing too many combinations", () => {
      const classNames = Array(100)
        .fill("")
        .map((_, index) => `class${String(index)}`)
        .join(" ");
      root.innerHTML = `<div class="${classNames}"></div>`;
      const start = Date.now();
      getCssSelector(root.firstElementChild, { maxCombinations: 100 });
      const end = Date.now();

      assert.isBelow(end - start, 100);
    });
  });

  describe("generator", () => {
    it("should yield multiple selectors", () => {
      root.innerHTML = "<div class='aaa bbb ccc'></div>";
      const selectorTarget = root.firstElementChild;
      const generator = cssSelectorGenerator(selectorTarget, {
        maxResults: 10,
      });
      const result = [...generator];
      assert.deepEqual(result, [
        ".aaa",
        ".bbb",
        ".ccc",
        ".aaa.bbb",
        ".aaa.ccc",
        ".bbb.ccc",
        ".aaa.bbb.ccc",
        "div.aaa",
        "div.bbb",
        "div.ccc",
      ]);
    });
  });

  describe("ignoreGeneratedClassNames option", () => {
    it("should prefer word-like classes over generated ones", () => {
      root.innerHTML = `
        <div class="container css-123abc"></div>
        <div class="other css-456def"></div>
      `;
      const result = getCssSelector(root.firstElementChild, {
        root: root,
        selectors: ["class", "id", "tag"],
        ignoreGeneratedClassNames: true,
      });
      assert.equal(result, ".container");
    });

    it("should work with mixed generated and regular classes", () => {
      root.innerHTML = '<div class="sc-xyz button-primary makeStyles-123"></div>';
      const result = getCssSelector(root.firstElementChild, {
        ignoreGeneratedClassNames: true,
      });
      assert.equal(result, ".button-primary");
    });

    it("should fall back to tag selector when all classes are generated", () => {
      root.innerHTML = '<span class="css-abc xyz"></span>';
      const result = getCssSelector(root.firstElementChild, {
        ignoreGeneratedClassNames: true,
      });
      assert.equal(result, "span");
    });

    it("should fall back to nth-child when only generated class present", () => {
      root.innerHTML = `
        <span class="css-unique123"></span>
        <span class="other"></span>
      `;
      const result = getCssSelector(root.firstElementChild, {
        root: root,
        selectors: ["class", "tag", "nthchild"],
        includeTag: true,
        ignoreGeneratedClassNames: true,
      });
      assert.equal(result, "span:nth-child(1)");
    });

    it("should work with unique generated classes when option is disabled", () => {
      root.innerHTML = `
        <div class="css-unique123"></div>
        <div class="css-unique456"></div>
      `;
      const result = getCssSelector(root.firstElementChild, {
        ignoreGeneratedClassNames: false,
      });
      assert.equal(result, ".css-unique123");
    });

    it("should demonstrate regular classes preferred even when not unique", () => {
      root.innerHTML = `
        <div class="button css-unique1"></div>
        <div class="button css-unique2"></div>
        <div class="other css-unique3"></div>
      `;
      const result = getCssSelector(root.firstElementChild, {
        root: root,
        selectors: ["class", "id", "tag", "nthchild"],
        ignoreGeneratedClassNames: true,
      });
      // "button" is shared, so should fall back to combining with tag or nth-child
      // The important thing is that it doesn't use the unique generated class
      assert.notEqual(result, ".css-unique1");
      // Should use button with nth-child or similar, not the generated class
      assert.match(result, /button|:nth-child/);
    });

    it("should work with BEM notation", () => {
      root.innerHTML = `
        <div class="block__element--modifier css-123"></div>
        <div class="other__element--modifier css-456"></div>
      `;
      const result = getCssSelector(root.firstElementChild, {
        ignoreGeneratedClassNames: true,
      });
      assert.equal(result, ".block__element--modifier");
    });

    it("should work with camelCase class names", () => {
      root.innerHTML = `
        <div class="navButton css-xyz"></div>
        <div class="otherButton css-abc"></div>
      `;
      const result = getCssSelector(root.firstElementChild, {
        ignoreGeneratedClassNames: true,
      });
      assert.equal(result, ".navButton");
    });

    it("should work with kebab-case class names", () => {
      root.innerHTML = `
        <div class="navbar-button css-123"></div>
        <div class="other-button css-456"></div>
      `;
      const result = getCssSelector(root.firstElementChild, {
        ignoreGeneratedClassNames: true,
      });
      assert.equal(result, ".navbar-button");
    });

    it("should interact correctly with blacklist option", () => {
      root.innerHTML = `
        <div class="css-unique1 button primary"></div>
        <div class="css-unique2 other warning"></div>
      `;
      const result = getCssSelector(root.firstElementChild, {
        ignoreGeneratedClassNames: true,
        blacklist: [".button"],
      });
      // Should ignore generated classes (css-unique1) which comes first
      // and blacklisted "button", leaving "primary" as the selector
      assert.equal(result, ".primary");
    });

    it("should interact correctly with whitelist option", () => {
      root.innerHTML = `
        <div class="css-unique button"></div>
        <div class="css-other button"></div>
      `;
      const result = getCssSelector(root.firstElementChild, {
        root: root,
        selectors: ["class"],
        ignoreGeneratedClassNames: true,
        whitelist: [".css-unique"],
      });
      // Whitelist should take precedence, allowing the generated class
      assert.equal(result, ".css-unique");
    });
  });
});
