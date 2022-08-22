import { assert } from "chai";
import { testSelector } from "../src/utilities-dom.ts";
import { getCssSelector } from "../src/index.ts";

describe("CssSelectorGenerator", function () {
  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  describe("basic scenarios", function () {
    it("should get shallow selector", function () {
      root.innerHTML = '<div class="aaa"></div>';
      const result = getCssSelector(root.firstElementChild, { root });
      assert.equal(result, ".aaa");
    });

    it("should get deep selector", function () {
      root.innerHTML =
        '<div id="aaa" class="aaa"><div><div class="aaa"></div></div></div>';
      const element = root.firstElementChild.firstChild.firstChild;
      const result = getCssSelector(element, { root });
      assert.equal(result, "#aaa .aaa");
    });

    it("should produce descendant selector", () => {
      root.innerHTML = `
      <div>
        <span>
          <span></span>
        </span>
      </div>
    `;
      const needle = root.firstElementChild.firstElementChild;
      const result = getCssSelector(needle, { root });
      assert.equal(result, "div > span");
    });

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
        .map((_, index) => `class${index}`)
        .join(" ");
      root.innerHTML = `<div class="${classNames}"></div>`;
      const start = Date.now();
      getCssSelector(root.firstElementChild, { maxCombinations: 100 });
      const end = Date.now();

      assert.isBelow(end - start, 100);
    });
  });

  describe("class selectors", function () {
    it("should get class selector", function () {
      root.innerHTML = '<div class="aaa"></div>';
      const result = getCssSelector(root.firstElementChild, {
        selectors: ["class"],
        root,
      });
      assert.equal(result, ".aaa");
    });

    it("should use single unique class", function () {
      root.innerHTML = '<div class="aaa bbb"></div><div class="aaa ccc"></div>';
      const result = getCssSelector(root.firstElementChild, {
        selectors: ["class"],
        root,
      });
      assert.equal(result, ".bbb");
    });

    it("should use combination of class names", function () {
      root.innerHTML =
        "" +
        '<div class="aaa bbb"></div>' +
        '<div class="aaa ccc"></div>' +
        '<div class="bbb ccc"></div>';
      const result = getCssSelector(root.firstElementChild, {
        selectors: ["class"],
        root,
      });
      assert.equal(result, ".aaa.bbb");
    });
  });

  describe("fallback", function () {
    it("should use nth-child descendants", function () {
      root.innerHTML = "<div><div><div></div></div></div>";
      const element =
        root.firstElementChild.firstElementChild.firstElementChild;
      const result = getCssSelector(element, {
        root,
        selectors: [],
      });
      assert.ok(testSelector([element], result, root));
    });
  });

  describe("multiple elements", () => {
    it("should get single selector matching multiple elements", () => {
      root.innerHTML = `
        <div class="aaa bbb"></div>
        <span class="bbb ccc"></span>
      `;
      const elements = [...root.querySelectorAll(".bbb")];
      const result = getCssSelector(elements);
      assert.equal(result, ".bbb");
    });

    it("should get combined selector matching multiple elements", () => {
      root.innerHTML = "<a></a><span></span>";
      const elements = [root.children[0], root.children[1]];
      const result = getCssSelector(elements);
      assert.equal(result, "a, span");
    });

    it("should get fallback selectors for multiple elements", () => {
      root.innerHTML = "<div></div><div></div><div></div>";
      const elements = [root.children[0], root.children[1]];
      const result = getCssSelector(elements);
      assert.ok(testSelector(elements, result));
    });
  });
});
