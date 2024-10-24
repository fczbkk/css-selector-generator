import { assert } from "chai";
import getCssSelector from "../src/index.js";
import { getAttributeSelectors } from "../src/selector-attribute.js";
import { CssSelectorGenerated } from "../src/types";

describe("selector - attribute", function () {
  let root: Element;

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
    const expectation = "[aaa='bbb\\ ccc']" as CssSelectorGenerated;
    assert.include(result, expectation);
  });

  it("should quote attribute values", function () {
    root.innerHTML = '<div aaa="bbb:ccc"></div>';
    const result = getAttributeSelectors([root.firstElementChild]);
    const expectation = "[aaa='bbb\\:ccc']" as CssSelectorGenerated;
    assert.include(result, expectation);
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

  it("should ignore base64 encoded 'src' attribute values", () => {
    root.innerHTML =
      '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAFE2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMTAtMjRUMTE6NTA6MjArMDIwMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMTAtMjRUMTE6NTA6MzkrMDI6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMTAtMjRUMTE6NTA6MzkrMDI6MDAiCiAgIHBob3Rvc2hvcDpEYXRlQ3JlYXRlZD0iMjAyNC0xMC0yNFQxMTo1MDoyMCswMjAwIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMSIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICB0aWZmOkltYWdlV2lkdGg9IjEiCiAgIHRpZmY6SW1hZ2VMZW5ndGg9IjEiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjMwMC8xIgogICB0aWZmOllSZXNvbHV0aW9uPSIzMDAvMSI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InByb2R1Y2VkIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZmZpbml0eSBEZXNpZ25lciAyIDIuNS41IgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTEwLTI0VDExOjUwOjM5KzAyOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz442FO+AAABgWlDQ1BzUkdCIElFQzYxOTY2LTIuMQAAKJF1kd8rg1EYxz8bom1MzYULF0vIxaahFjfKlkYtaaYMN9u7X2qbt/edJLfK7YoSN35d8Bdwq1wrRaTketfEDev1vKYm2XN6zvM533Oep3OeA9ZoTsnrjT7IF4paJBRwz8cW3M1lbLiw009bXNHV8ZmZMHXt/R6LGW+9Zq365/41ezKlK2BpER5TVK0oPCkcXiuqJu8IdyjZeFL4TNijyQWF70w9UeWyyZkqf5qsRSNBsLYLuzO/OPGLlayWF5aX05PPrSo/9zFf4kgV5mYldot3oRMhRAA3U0wQxM8gozL78TLEgKyok+/7zp9mRXIVmVXW0VgmQ5YiHlFXpXpKYlr0lIwc62b///ZVTw8PVas7AtD0bBivvdC8DZWSYXwcGUblGBqe4LJQy185hJE30Us1recAnJtwflXTErtwsQWdj2pci39LDeLWdBpeTqE1Bq4bsC1We/azz8kDRDfkq65hbx/65Lxz6QtLWGfZQ2fibgAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAxJREFUCJlj+P//PwAF/gL+WPJrDgAAAABJRU5ErkJggg==" />';
    const result = getAttributeSelectors([root.firstElementChild]);
    assert.sameMembers(result, []);
  });
});
