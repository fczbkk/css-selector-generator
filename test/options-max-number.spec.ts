import { assert } from "chai";
import { sanitizeMaxNumber } from "../src/utilities-options.js";

describe("options: maxNumber", () => {
  it("should default to positive infinity", () => {
    const result = sanitizeMaxNumber();
    assert.equal(result, Number.POSITIVE_INFINITY);
  });

  it("should convert non-numbers to positive infinity", () => {
    const result = sanitizeMaxNumber("xxx");
    assert.equal(result, Number.POSITIVE_INFINITY);
  });

  it("should keep number as is", () => {
    const result = sanitizeMaxNumber(123);
    assert.equal(result, 123);
  });
});
