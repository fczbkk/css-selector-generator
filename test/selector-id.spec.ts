import { assert } from "chai";
import { getIdSelector } from "../src/selector-id.js";

describe("selector - ID", function () {
  let root: Element;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should generate ID selector", function () {
    root.innerHTML = '<div id="aaa"></div>';
    assert.deepEqual(getIdSelector([root.firstElementChild]), ["#aaa"]);
  });

  it("should return `null` if ID is not set", function () {
    root.innerHTML = "<div></div>";
    assert.deepEqual(getIdSelector([root.firstElementChild]), []);
  });

  it("should escape special characters", function () {
    root.innerHTML = '<div id="aaa+bbb"></div>';
    assert.deepEqual(getIdSelector([root.firstElementChild]), ["#aaa\\+bbb"]);
  });

  it("should escape colon character", function () {
    root.innerHTML = '<div id="aaa:bbb"></div>';
    assert.deepEqual(getIdSelector([root.firstElementChild]), ["#aaa\\:bbb"]);
  });

  it("should escape ID beginning with a number", function () {
    root.innerHTML = '<div id="1aaa"></div>';
    assert.deepEqual(getIdSelector([root.firstElementChild]), ["#\\31 aaa"]);
  });

  it("should ignore non-unique ID attribute", function () {
    root.innerHTML = '<div id="aaa"></div><div id="aaa"></div>';
    assert.deepEqual(getIdSelector([root.firstElementChild]), []);
  });

  it("should ignore empty ID attribute", function () {
    root.innerHTML = '<div id=""></div>';
    assert.deepEqual(getIdSelector([root.firstElementChild]), []);
  });

  it("should ignore ID attribute containing white-space", function () {
    root.innerHTML = '<div id="aaa bbb"></div>';
    assert.deepEqual(getIdSelector([root.firstElementChild]), []);
  });

  it("should ignore ID attribute containing only white-space", function () {
    root.innerHTML = '<div id="   "></div>';
    assert.deepEqual(getIdSelector([root.firstElementChild]), []);
  });

  it("should always return empty result for multiple elements", () => {
    root.innerHTML = `
      <div id="aaa"></div>
      <div id="bbb"></div>
    `;
    const elements = [...root.querySelectorAll("div")];
    assert.sameMembers(getIdSelector(elements), []);
  });
});
