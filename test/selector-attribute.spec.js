import { assert } from "chai";
import getCssSelector from "../src/index.ts";
import { getAttributeSelectors } from "../src/selector-attribute.ts";

describe("selector - attribute", function () {
  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should generate attribute selectors", function () {
    root.innerHTML = '<div aaa="bbb" ccc="ddd"></div>';
    const result = getAttributeSelectors([root.firstElementChild]);
    assert.sameMembers(result, [
      "[aaa]",
      "[aaa='bbb']",
      "[ccc]",
      "[ccc='ddd']",
    ]);
  });

  it("should put simplified selector before full selector", () => {
    root.innerHTML = '<div aaa="bbb"></div>';
    const result = getAttributeSelectors([root.firstElementChild]);
    assert.sameOrderedMembers(result, ["[aaa]", "[aaa='bbb']"]);
  });

  it("should ignore ID attribute", function () {
    root.innerHTML = '<div id="aaa"></div>';
    const result = getAttributeSelectors([root.firstElementChild]);
    assert.lengthOf(result, 0);
  });

  it("should ignore class attribute", function () {
    root.innerHTML = '<div class="aaa"></div>';
    const result = getAttributeSelectors([root.firstElementChild]);
    assert.lengthOf(result, 0);
  });

  it("should sanitize attribute values", function () {
    root.innerHTML = '<div aaa="bbb ccc"></div>';
    const result = getAttributeSelectors([root.firstElementChild]);
    assert.include(result, "[aaa='bbb\\ ccc']");
  });

  it("should quote attribute values", function () {
    root.innerHTML = '<div aaa="bbb:ccc"></div>';
    const result = getAttributeSelectors([root.firstElementChild]);
    assert.include(result, "[aaa='bbb\\:ccc']");
  });

  it("should ignore Angular attributes", function () {
    root.innerHTML = '<div ng-aaa="bbb"></div>';
    const result = getAttributeSelectors([root.firstElementChild]);
    assert.equal(result.length, 0);
  });

  it("should generate attribute selectors for multiple elements", function () {
    root.innerHTML = `
      <div aaa="bbb" ccc="ddd"></div>
      <div aaa="bbb"></div>
      <div xxx="yyy"></div>
    `;
    const elements = root.querySelectorAll("div");
    const withIntersection = getAttributeSelectors([elements[0], elements[1]]);
    const noIntersection = getAttributeSelectors([elements[0], elements[2]]);
    assert.sameMembers(withIntersection, ["[aaa]", "[aaa='bbb']"]);
    assert.sameMembers(noIntersection, []);
  });

  it("should prefer simplified selector if possible", () => {
    root.innerHTML = `
      <div aaa="bbb"></div>
      <div ccc="ddd"></div>
    `;
    const result = getCssSelector(root.firstElementChild);
    assert.equal(result, "[aaa]");
  });

  it("should use full selector", () => {
    root.innerHTML = `
      <div aaa="bbb"></div>
      <div aaa="ccc"></div>
    `;
    const result = getCssSelector(root.firstElementChild);
    assert.equal(result, "[aaa='bbb']");
  });

  it("should use simplified selector for multiple elements", () => {
    root.innerHTML = `
      <div aaa="bbb"></div>
      <div aaa="ccc"></div>
    `;
    const result = getCssSelector(Array.from(root.children));
    assert.equal(result, "[aaa]");
  });

  it("should escape attribute values", () => {
    root.innerHTML = '<div width="30%"></div><div width="100%"></div>';
    const result = getCssSelector(root.firstElementChild);
    assert.deepEqual(result, "[width='\\33 0\\%']");
  });

  it("should ignore `value` attribute on INPUT elements", () => {
    root.innerHTML = '<input value="123" /><input value="456" />';
    const result = getCssSelector(root.firstElementChild);
    assert.notMatch(result, /^\[/);
  });

  it("should ignore `value` attribute on OPTION elements", () => {
    root.innerHTML = '<option value="123" /><option value="456" />';
    const result = getCssSelector(root.firstElementChild);
    assert.notMatch(result, /^\[/);
  });

  it("should escape attributes containing colons and semicolons", () => {
    root.innerHTML = '<div aaa:bbb="ccc" ddd;eee="fff" :="ggg" ;="hhh" : ; />';
    const element = root.firstElementChild;
    const selectors = getAttributeSelectors([element]);
    selectors.forEach((selector) => {
      assert.doesNotThrow(() => document.querySelector(selector), selector);
      assert.equal(document.querySelector(selector), element);
    });
  });
});
