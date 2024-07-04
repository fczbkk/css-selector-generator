import { assert } from "chai";
import { createPatternMatcher } from "../src/utilities-data.js";

describe("utilities - pattern matcher", () => {
  it("should always return false when empty", () => {
    const matchPattern = createPatternMatcher([]);
    assert.equal(matchPattern("aaa"), false);
  });

  it("should match simple string pattern", () => {
    const matchPattern = createPatternMatcher(["aaa"]);
    assert.equal(matchPattern("aaa"), true);
    assert.equal(matchPattern("bbb"), false);
    assert.equal(matchPattern("aaabbb"), false);
    assert.equal(matchPattern("bbbaaa"), false);
    assert.equal(matchPattern("bbbaaabbb"), false);
    assert.equal(matchPattern("aaabbbaaa"), false);
  });

  it("should match simple wildcard pattern", () => {
    const matchPattern = createPatternMatcher(["a*"]);
    assert.equal(matchPattern("aaa"), true);
    assert.equal(matchPattern("bbb"), false);
    assert.equal(matchPattern("aaabbb"), true);
    assert.equal(matchPattern("bbbaaa"), false);
    assert.equal(matchPattern("bbbaaabbb"), false);
    assert.equal(matchPattern("aaabbbaaa"), true);
  });

  it("should treat string patterns as case sensitive", () => {
    const matchPattern = createPatternMatcher(["aaa", "b*"]);
    assert.equal(matchPattern("aaa"), true);
    assert.equal(matchPattern("bbb"), true);
    assert.equal(matchPattern("AAA"), false);
    assert.equal(matchPattern("BBB"), false);
  });

  it("should match simple regex pattern", () => {
    const matchPattern = createPatternMatcher([/aaa/]);
    assert.equal(matchPattern("aaa"), true);
    assert.equal(matchPattern("bbb"), false);
    assert.equal(matchPattern("aaabbb"), true);
    assert.equal(matchPattern("bbbaaa"), true);
    assert.equal(matchPattern("bbbaaabbb"), true);
    assert.equal(matchPattern("aaabbbaaa"), true);
  });

  it("should match multiple patterns", () => {
    const matchPattern = createPatternMatcher(["first", "s*d", /third/]);
    assert.equal(matchPattern("first"), true);
    assert.equal(matchPattern("second"), true);
    assert.equal(matchPattern("third"), true);
    assert.equal(matchPattern("fourth"), false);
  });

  it("should keep regex flags", () => {
    const matchPattern = createPatternMatcher(["static", /loose/i, /strict/]);
    assert.equal(matchPattern("static"), true);
    assert.equal(matchPattern("STATIC"), false);
    assert.equal(matchPattern("loose"), true);
    assert.equal(matchPattern("LOOSE"), true);
    assert.equal(matchPattern("strict"), true);
    assert.equal(matchPattern("STRICT"), false);
  });

  it("should accept function", () => {
    const matchFunction = (input) => input === "aaa";
    const matchPattern = createPatternMatcher([matchFunction]);
    assert.equal(matchPattern("aaa"), true);
    assert.equal(matchPattern("xxx"), false);
  });

  it("should always return `false` if function returns non-boolean", () => {
    const matchFunction = () => "non-boolean return value";
    // @ts-expect-error: intentionally using wrong input for test purposes
    const matchPattern = createPatternMatcher([matchFunction]);
    assert.equal(matchPattern("aaa"), false);
  });

  it("should ignore invalid inputs", () => {
    const matchPattern = createPatternMatcher([
      // @ts-expect-error: intentionally using wrong input for test purposes
      true,
      // @ts-expect-error: intentionally using wrong input for test purposes
      false,
      undefined,
      null,
      // @ts-expect-error: intentionally using wrong input for test purposes
      123,
      // @ts-expect-error: intentionally using wrong input for test purposes
      [],
      // @ts-expect-error: intentionally using wrong input for test purposes
      {},
    ]);
    assert.equal(matchPattern("aaa"), false);
  });
});
