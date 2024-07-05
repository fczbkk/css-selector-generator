import { assert } from "chai";
import { getTagSelector } from "../src/selector-tag.js";

describe("selector - tag", function () {
  let root: Element;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should generate tag selector", function () {
    root.innerHTML = "<div></div>";
    const element = root.firstElementChild;
    const selector = getTagSelector([element]);
    assert.sameMembers(selector, ["div"]);
    assert.equal(root.querySelector(selector), element);
  });

  it("should generate selector for namespaced element", function () {
    root.innerHTML = "<aaa:bbb></aaa:bbb>";
    const element = root.firstElementChild;
    const selector = getTagSelector([element]);
    assert.equal(selector[0], "aaa\\:bbb");
    assert.equal(root.querySelector(selector), element);
  });

  it("should generate tag selector for multiple elements", () => {
    root.innerHTML = "<div></div><div></div>";
    const elements = [...root.querySelectorAll("div")];
    const result = getTagSelector(elements);
    assert.sameMembers(result, ["div"]);
  });
});
