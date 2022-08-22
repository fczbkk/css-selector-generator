import { assert } from "chai";
import { getPowerSet } from "../src/utilities-powerset";

describe("utilities - powerset", () => {
  it("should generate empty result from empty input", () => {
    const result = getPowerSet([]);
    assert.sameDeepOrderedMembers(result, []);
  });

  it("should generate all combinations", () => {
    const result = getPowerSet(["a", "b", "c"]);
    const expectation = [
      ["a"],
      ["b"],
      ["c"],
      ["a", "b"],
      ["a", "c"],
      ["b", "c"],
      ["a", "b", "c"],
    ];
    assert.sameDeepOrderedMembers(result, expectation);
  });

  it("should apply maxResults limit", () => {
    const result = getPowerSet(["a", "b", "c"], { maxResults: 5 });
    const expectation = [["a"], ["b"], ["c"], ["a", "b"], ["a", "c"]];
    assert.sameDeepOrderedMembers(result, expectation);
  });
});
