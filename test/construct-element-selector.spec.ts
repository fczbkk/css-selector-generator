import { assert } from "chai";
import {
  constructElementSelector,
  createElementData,
} from "../src/utilities-element-data.js";
import { CSS_SELECTOR_TYPE, ElementData, OPERATOR } from "../src/types.js";

/**
 * Utility function that marks all selectors in elementData as included.
 */
function includeAllSelectors(elementData: ElementData) {
  Object.values(elementData.selectors).forEach((selectorDataList) => {
    selectorDataList.forEach((selectorData) => (selectorData.include = true));
  });
}

describe("utilities - constructElementSelector", () => {
  let root: Element;

  beforeEach(() => {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(() => {
    root.parentNode.removeChild(root);
  });

  it("should include parts", () => {
    const element = document.createElement("div");
    element.setAttribute("id", "mockId");
    element.setAttribute("class", "mockClass1 mockClass2");
    root.appendChild(element);
    const elementData = createElementData(element, [
      CSS_SELECTOR_TYPE.id,
      CSS_SELECTOR_TYPE.tag,
      CSS_SELECTOR_TYPE.class,
    ]);
    includeAllSelectors(elementData);
    const result = constructElementSelector(elementData);
    assert.equal(result, "div#mockId.mockClass1.mockClass2");
  });

  it("should include operator", () => {
    const element = document.createElement("div");
    root.appendChild(element);
    const elementData = createElementData(element, [CSS_SELECTOR_TYPE.tag]);
    elementData.operator = OPERATOR.CHILD;
    includeAllSelectors(elementData);
    const result = constructElementSelector(elementData);
    assert.equal(result, " > div");
  });
});
