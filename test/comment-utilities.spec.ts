import { parseComment, parseElementComments } from "./comment-utilities";
import { assert } from "chai";

describe.only("Comment Utilities", () => {
  describe("parseComment", () => {
    it("should parse empty comment", () => {
      const result = parseComment("");
      assert.deepEqual(result, { name: [], expect: [] });
    });
    describe("name", () => {
      it("should parse a name", () => {
        const { name } = parseComment("name: mock name");
        assert.deepEqual(name, ["mock name"]);
      });
      it("should parse a multiple name properties", () => {
        const { name } = parseComment("name: first name; name: second name");
        assert.deepEqual(name, ["first name", "second name"]);
      });
      it("should parse a multiple names within single property", () => {
        const { name } = parseComment("name: first name / second name");
        assert.deepEqual(name, ["first name", "second name"]);
      });
    });
    describe("expect", () => {
      it("should parse expectation", () => {
        const { expect } = parseComment("expect: mock name / .aaa");
        assert.deepEqual(expect, [{ name: "mock name", selector: ".aaa" }]);
      });
    });
    describe("other", () => {
      it("should ignore unknown properties", () => {
        const result = parseComment(
          "xxx: first invalid property; yyy: second invalid property; name: valid property",
        );
        assert.deepEqual(result, { name: ["valid property"], expect: [] });
      });
      it("should parse multiline comments", () => {
        const result = parseComment(
          "name: mock name\nexpect: mock name / .aaa",
        );
        assert.deepEqual(result, {
          name: ["mock name"],
          expect: [{ name: "mock name", selector: ".aaa" }],
        });
      });
    });
  });

  describe("parseElementComments", () => {
    it("should parse empty list", () => {
      const result = parseElementComments([]);
      assert.deepEqual(result, { name: [], expect: [] });
    });
    it("should parse single comment", () => {
      const result = parseElementComments([
        "name: mock name; expect: mock name / .aaa",
      ]);
      assert.deepEqual(result, {
        name: ["mock name"],
        expect: [{ name: "mock name", selector: ".aaa" }],
      });
    });
    it("should merge data from multiple comments", () => {
      const result = parseElementComments([
        "name: mock name; expect: mock name / .aaa",
        "name: mock name 2; expect: mock name 2 / .bbb",
      ]);
      assert.deepEqual(result, {
        name: ["mock name", "mock name 2"],
        expect: [
          { name: "mock name", selector: ".aaa" },
          { name: "mock name 2", selector: ".bbb" },
        ],
      });
    });
    it("should keep list of names unique", () => {
      const result = parseElementComments(["name: mock name; name: mock name"]);
      assert.deepEqual(result, {
        name: ["mock name"],
        expect: [],
      });
    });
    it("should add expect names if missing", () => {
      const result = parseElementComments(["expect: mock name / .aaa"]);
      assert.deepEqual(result, {
        name: ["mock name"],
        expect: [{ name: "mock name", selector: ".aaa" }],
      });
    });
    it("should generate random expect name if there are none defined", () => {
      const result = parseElementComments(["expect: .aaa"]);
      const randomName = result.name[0];
      assert.deepEqual(result, {
        name: [randomName],
        expect: [{ name: randomName, selector: ".aaa" }],
      });
    });
  });
});
