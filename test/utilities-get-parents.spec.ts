import { assert } from "chai";
import { getParents } from "../src/utilities-dom.js";

describe("utilities - getParents", function () {
  let root: Element;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should get parents of an element", function () {
    root.innerHTML = "<div><ul><li></li></ul></div>";
    const element = root.querySelector("li");
    const result = getParents([element], root);
    assert.lengthOf(result, 3);
    assert.equal(result[0].tagName, "LI");
    assert.equal(result[1].tagName, "UL");
    assert.equal(result[2].tagName, "DIV");
  });

  it("should return path for parent-less element", function () {
    const element = document.createElement("div");
    const result = getParents([element], root);
    assert.lengthOf(result, 1);
  });

  it("should return empty array if element is invalid", function () {
    const element = "xxx";
    // @ts-expect-error: intentionally using wrong input for test purposes
    const result = getParents([element], root);
    assert.lengthOf(result, 0);
  });

  it("should find common parents for multiple elements", () => {
    root.innerHTML = `
      <div>
        <ul>
          <li></li>
        </ul>
        <ul>
          <li></li>
        </ul>
      </div>
    `;
    const elements = [...root.querySelectorAll("li")];
    const result = getParents(elements, root);
    assert.lengthOf(result, 1);
    assert.equal(result[0].tagName, "DIV");
  });
});
