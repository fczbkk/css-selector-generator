import { assert } from "chai";
import { getCartesianProduct } from "../src/utilities-cartesian.js";

describe("utilities - cartesian", () => {
  it("should generate empty result from empty input", () => {
    const result = getCartesianProduct();
    assert.sameDeepOrderedMembers(result, []);
  });

  it("should generate from simple input", () => {
    const input = { a: ["a1", "a2", "a3"] };
    const expectation = [{ a: "a1" }, { a: "a2" }, { a: "a3" }];
    const result = getCartesianProduct(input);
    assert.sameDeepOrderedMembers(result, expectation);
  });

  it("should generate from complex input", () => {
    const input = { a: ["a1", "a2", "a3"], b: ["b1"], c: ["c1", "c2"] };
    const expectation = [
      { a: "a1", b: "b1", c: "c1" },
      { a: "a2", b: "b1", c: "c1" },
      { a: "a3", b: "b1", c: "c1" },
      { a: "a1", b: "b1", c: "c2" },
      { a: "a2", b: "b1", c: "c2" },
      { a: "a3", b: "b1", c: "c2" },
    ];
    const result = getCartesianProduct(input);
    assert.sameDeepOrderedMembers(result, expectation);
  });
});
