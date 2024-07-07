import { assert } from "chai";
import { getCssSelector } from "../src";

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
});
