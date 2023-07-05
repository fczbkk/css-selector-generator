import { assert } from "chai";
import { createMemo } from "../src/memo.js";
import { CSS_SELECTOR_TYPE } from "../src/types.js";
import {
  createRoot,
  getTargetElement,
  getTargetElements,
} from "./test-utilities";

describe("Memo", () => {
  let root: Element;
  beforeEach(() => {
    root = createRoot();
  });
  afterEach(() => {
    root.parentNode.removeChild(root);
  });

  it("should retrieve selectors for an element", () => {
    root.innerHTML = "<div data-target></div>";
    const element = getTargetElement(root);
    const getElementSelectors = createMemo();
    const result = getElementSelectors(element, [CSS_SELECTOR_TYPE.tag]);
    assert.deepEqual(result, { [CSS_SELECTOR_TYPE.tag]: ["div"] });
  });

  it("should retrieve common selectors for multiple elements", () => {
    root.innerHTML = `
      <div data-target class='aaa bbb'></div>
      <div data-target class='aaa ccc'></div>
    `;
    const elements = [...getTargetElements(root)];
    const getElementSelectors = createMemo();
    const result = getElementSelectors(elements, [CSS_SELECTOR_TYPE.class]);
    assert.deepEqual(result, { [CSS_SELECTOR_TYPE.class]: [".aaa"] });
  });

  it("should use remembered value", () => {
    root.innerHTML = "<div data-target></div>";
    const element = getTargetElement(root);
    const memoData = new Map([
      [element, new Map([[CSS_SELECTOR_TYPE.tag, ["mock_tag_selector"]]])],
    ]);
    const getElementSelectors = createMemo(memoData);
    const result = getElementSelectors(element, [CSS_SELECTOR_TYPE.tag]);
    assert.deepEqual(result, {
      [CSS_SELECTOR_TYPE.tag]: ["mock_tag_selector"],
    });
  });
});
