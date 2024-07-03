import { assert } from "chai";
import { CSS_SELECTOR_TYPE, OPERATOR } from "../src/types.js";
import { createElementData } from "../src/utilities-element-data.js";

describe("utilities - createElementData", () => {
  const element = document.createElement("div");

  it("should contain input element", () => {
    const result = createElementData(element, []);
    assert.equal(result.element, element);
  });

  it('should contain "none" operator by default', () => {
    const result = createElementData(element, []);
    assert.equal(result.operator, OPERATOR.NONE);
  });

  it("should only contain defined selector types", () => {
    const result = createElementData(element, [CSS_SELECTOR_TYPE.tag]);
    assert.deepEqual(Object.keys(result.selectors), ["tag"]);
  });

  it("should contain selectors data", () => {
    const result = createElementData(element, [CSS_SELECTOR_TYPE.tag]);
    assert.deepEqual(result.selectors.tag, [{ value: "div", include: false }]);
  });
});
