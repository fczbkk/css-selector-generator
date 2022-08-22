import { assert } from "chai";
import { createMemo } from "../src/memo.ts";

describe("Memo", () => {
  let root;

  /**
   * Simple way to retrieve target element for test.
   * @returns {Element}
   */
  function getTargetElement() {
    return root.querySelector("[data-target]");
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
    const result = getElementSelectors([element], ["tag"]);
    assert.deepEqual(result, { tag: ["div"] });
  });

  it("should use remembered value", () => {
    root.innerHTML = "<div data-target></div>";
    const element = getTargetElement();
    const memoData = new Map([
      [element, new Map([["tag", ["mock_tag_selector"]]])],
    ]);
    const getElementSelectors = createMemo(memoData);
    const result = getElementSelectors(element, ["tag"]);
    assert.deepEqual(result, { tag: ["mock_tag_selector"] });
  });
});
