import { assert } from "chai";
import { createMemo } from "../src/memo.js";
import { CssSelectorType } from "../src/types.js";

describe("Memo", () => {
  let root: HTMLElement;

  /**
   * Simple way to retrieve target element for test.
   * @returns {Element}
   */
  function getTargetElement() {
    return root.querySelector("[data-target]");
  }

  /**
   * Simple way to retrieve multiple target elements for test.
   * @returns {Element[]}
   */
  function getTargetElements() {
    return root.querySelectorAll("[data-target]");
  }

  beforeEach(() => {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(() => {
    root.parentNode.removeChild(root);
  });

  it("should retrieve selectors for an element", () => {
    root.innerHTML = "<div data-target></div>";
    const element = getTargetElement();
    const getElementSelectors = createMemo();
    const result = getElementSelectors(element, [CssSelectorType.tag]);
    assert.deepEqual(result, { [CssSelectorType.tag]: ["div"] });
  });

  it("should retrieve common selectors for multiple elements", () => {
    root.innerHTML = `
      <div data-target class='aaa bbb'></div>
      <div data-target class='aaa ccc'></div>
    `;
    const elements = [...getTargetElements()];
    const getElementSelectors = createMemo();
    const result = getElementSelectors(elements, [CssSelectorType.class]);
    assert.deepEqual(result, { [CssSelectorType.class]: [".aaa"] });
  });

  it("should use remembered value", () => {
    root.innerHTML = "<div data-target></div>";
    const element = getTargetElement();
    const memoData = new Map([
      [element, new Map([[CssSelectorType.tag, ["mock_tag_selector"]]])],
    ]);
    const getElementSelectors = createMemo(memoData);
    const result = getElementSelectors(element, [CssSelectorType.tag]);
    assert.deepEqual(result, { [CssSelectorType.tag]: ["mock_tag_selector"] });
  });
});
