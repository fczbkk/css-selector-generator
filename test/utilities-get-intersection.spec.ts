import { assert } from "chai";
import { getIntersection } from "../src/utilities-data.js";

describe("utilities - getIntersection", () => {
  it("should produce empty array from empty input", () => {
    const result = getIntersection();
    assert.sameMembers(result, []);
  });
  it("should replicate single array", () => {
    const result = getIntersection([["a", "b", "c"]]);
    assert.sameMembers(result, ["a", "b", "c"]);
  });
  it("should produce empty array if no intersection", () => {
    const result = getIntersection([
      ["a", "b", "c"],
      ["x", "y", "z"],
    ]);
    assert.sameMembers(result, []);
  });
  it("should produce intersecting members", () => {
    const result = getIntersection([
      ["a", "b", "c"],
      ["b", "c", "d"],
    ]);
    assert.sameMembers(result, ["b", "c"]);
  });
});
