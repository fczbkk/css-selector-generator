import { assert } from "chai";
import { getNthOfTypeSelector } from "../src/selector-nth-of-type.js";
import { getCssSelector } from "../src";
import { constructSelector } from "../src/utilities-selectors.js";
import { CSS_SELECTOR_TYPE } from "../src/types";

describe("selector - nth-of-type", function () {
  let root: Element;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should generate nth-of-type selector", function () {
    root.innerHTML = "<div></div><p></p><p></p>";
    const result = getNthOfTypeSelector([root.lastElementChild]);
    assert.equal(result.length, 1);
    assert.equal(result[0], "p:nth-of-type(2)");
  });

  it("should not include tag if nthoftype is used", function () {
    const result = constructSelector({
      tag: ["div"],
      nthoftype: ["div:nth-of-type(1)"],
    });
    assert.equal(result, "div:nth-of-type(1)");
  });

  it("should not collide with tag selector", function () {
    root.innerHTML = "<div></div><p></p><p></p>";
    const result = getCssSelector(root.lastChild, {
      selectors: ["tag", "nthoftype"],
      root,
    });
    assert.equal(result, "p:nth-of-type(2)");
  });

  it("should not collide with `includeTag` option", function () {
    root.innerHTML = "<div></div><p></p><p></p>";
    const result = getCssSelector(root.lastChild, {
      selectors: ["nthoftype"],
      includeTag: true,
      root,
    });
    assert.equal(result, "p:nth-of-type(2)");
  });

  it("should not throw for element without parent", function () {
    const element = document.createElement("div");
    const fn = function () {
      getCssSelector(element, {
        selectors: ["nthoftype"],
        root,
      });
    };
    assert.doesNotThrow(fn);
  });

  it("should not throw for element directly in document", function () {
    const element = document.querySelector("html");
    const fn = function () {
      getCssSelector(element, {
        selectors: ["nthoftype"],
        root,
      });
    };
    assert.doesNotThrow(fn);
  });

  it("should generate nth-of-type selector for multiple elements", () => {
    root.innerHTML = `
      <div><div></div><span></span></div>
      <div><span></span></div>
    `;
    const elements = [...root.querySelectorAll("span")];
    const result = getNthOfTypeSelector(elements);
    assert.sameMembers(result, ["span:nth-of-type(1)"]);
  });

  it("should ignore non-sibling elements when constructing", () => {
    root.innerHTML = `
      <div>
        <span></span>
        <div>
          <span></span>
        </div>
        <span class="target"></span>
      </div>
    `;
    const options = { root, selectors: [CSS_SELECTOR_TYPE.nthoftype] };
    const element = root.querySelector(".target");
    const result = getCssSelector(element, options);
    assert.equal(result, "span:nth-of-type(2)");
  });
});
