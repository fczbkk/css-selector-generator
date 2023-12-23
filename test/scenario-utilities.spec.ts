import { assert } from "chai";
import {
  parseAllComments,
  parseComment,
  parseCommentContent,
} from "./scenario-utilities.js";

describe("Scenario Utilities", () => {
  let rootElement: Element;

  beforeEach(() => {
    rootElement = document.createElement("div");
  });

  afterEach(() => {
    rootElement.remove();
  });

  describe("parseCommentContent", () => {
    it("should parse non-matching content", () => {
      const content = "some content";
      const result = parseCommentContent(content);
      assert.deepEqual(result, null);
    });

    it("should parse identifier", () => {
      const content = "identifier: mock identifier";
      const result = parseCommentContent(content);
      assert.deepEqual(result, { identifier: "mock identifier" });
    });

    it("should parse expectation", () => {
      const content = "expect: mock expectation";
      const result = parseCommentContent(content);
      assert.deepEqual(result, { expectation: "mock expectation" });
    });

    it("should parse identifier and expectation", () => {
      const content = "expect: mock identifier; mock expectation";
      const result = parseCommentContent(content);
      assert.deepEqual(result, {
        identifier: "mock identifier",
        expectation: "mock expectation",
      });
    });
  });

  describe("parseComment", () => {
    function generateComment(content: string): Comment {
      const comment = document.createComment(content);
      rootElement.appendChild(comment);
      return comment;
    }

    it("should parse non-matching comment", () => {
      const comment = generateComment("some content");
      const result = parseComment(comment);
      assert.deepEqual(result, null);
    });

    it("should parse identifier", () => {
      const comment = generateComment("identifier: mock identifier");
      const result = parseComment(comment);
      assert.deepEqual(result, {
        identifier: "mock identifier",
        element: comment.parentElement,
      });
    });

    it("should parse expectation", () => {
      const comment = generateComment("expect: mock expectation");
      const result = parseComment(comment);
      assert.deepEqual(result, {
        expectation: "mock expectation",
        element: comment.parentElement,
      });
    });

    it("should not include element if both identifier and expectation are present", () => {
      const comment = generateComment(
        "expect: mock identifier; mock expectation",
      );
      const result = parseComment(comment);
      assert.deepEqual(result, {
        identifier: "mock identifier",
        expectation: "mock expectation",
      });
    });
  });

  describe("parseAllComments", () => {
    it("should return empty if there are no comments", () => {
      rootElement.innerHTML = "<div></div>";
      const result = parseAllComments(rootElement);
      assert.deepEqual(result, new Map());
    });
    it("should return empty if there are no matching comments", () => {
      rootElement.innerHTML = "<div><!-- some comment --></div>";
      const result = parseAllComments(rootElement);
      assert.deepEqual(result, new Map());
    });
    it("should return selector associated with element to match", () => {
      rootElement.innerHTML = `
        <div id="mockId"><!-- expect: #mockId --></div>
      `;
      const result = parseAllComments(rootElement);
      const expectation = new Map([
        ["#mockId", new Set([rootElement.querySelector("#mockId")])],
      ]);

      assert.deepEqual(result, expectation);
    });
    it("should ignore element that has identifier, but not expectation", () => {
      rootElement.innerHTML = `
        <div id="mockId"><!-- identifier: mockElement --></div>
      `;
      const result = parseAllComments(rootElement);
      assert.deepEqual(result, new Map());
    });
    it("should return element with identifier and expectation", () => {
      rootElement.innerHTML = `
        <div id="mockId"><!-- identifier: mockElement --></div>
        <!-- expect: mockElement; #mockId -->
      `;
      const result = parseAllComments(rootElement);
      const expectation = new Map([
        ["#mockId", new Set([rootElement.querySelector("#mockId")])],
      ]);

      assert.deepEqual(result, expectation);
    });
    it("should return multiple elements with identifier and expectation", () => {
      rootElement.innerHTML = `
        <div id="firstMockId"><!-- expect: #firstMockId --></div>
        <div id="secondMockId"><!-- expect: #secondMockId --></div>
      `;
      const result = parseAllComments(rootElement);
      const expectation = new Map([
        ["#firstMockId", new Set([rootElement.querySelector("#firstMockId")])],
        [
          "#secondMockId",
          new Set([rootElement.querySelector("#secondMockId")]),
        ],
      ]);

      assert.deepEqual(result, expectation);
    });
    it("should return multiple elements with identical identifier", () => {
      rootElement.innerHTML = `
        <div class="mockClass"><!-- identifier: mockElement --></div>
        <div class="mockClass"><!-- identifier: mockElement --></div>
        <!-- expect: mockElement; .mockClass -->
      `;
      const result = parseAllComments(rootElement);
      const expectation = new Map([
        [".mockClass", new Set(rootElement.querySelectorAll(".mockClass"))],
      ]);

      assert.deepEqual(result, expectation);
    });
  });
});
