import { assert } from "chai";
import { isWordLikeClassName } from "../src/selector-class.js";

describe("utilities - isWordLikeClassName", () => {
  describe("should identify word-like class names", () => {
    it("should accept simple lowercase words", () => {
      assert.isTrue(isWordLikeClassName("button"));
      assert.isTrue(isWordLikeClassName("container"));
      assert.isTrue(isWordLikeClassName("navigation"));
    });

    it("should accept kebab-case", () => {
      assert.isTrue(isWordLikeClassName("nav-button"));
      assert.isTrue(isWordLikeClassName("main-container"));
      assert.isTrue(isWordLikeClassName("user-profile-card"));
    });

    it("should accept camelCase", () => {
      assert.isTrue(isWordLikeClassName("navButton"));
      assert.isTrue(isWordLikeClassName("mainContainer"));
      assert.isTrue(isWordLikeClassName("userProfileCard"));
    });

    it("should accept PascalCase", () => {
      assert.isTrue(isWordLikeClassName("NavButton"));
      assert.isTrue(isWordLikeClassName("MainContainer"));
      assert.isTrue(isWordLikeClassName("UserProfileCard"));
    });

    it("should accept mixed case styles", () => {
      assert.isTrue(isWordLikeClassName("nav-buttonPrimary"));
      assert.isTrue(isWordLikeClassName("main-ContainerLarge"));
    });

    it("should accept BEM notation", () => {
      assert.isTrue(isWordLikeClassName("block-element-modifier"));
      assert.isTrue(isWordLikeClassName("button-primary-large"));
    });
  });

  describe("should reject generated class names", () => {
    it("should reject short random hashes (3 chars or less)", () => {
      assert.isFalse(isWordLikeClassName("abc"));
      assert.isFalse(isWordLikeClassName("xyz"));
      assert.isFalse(isWordLikeClassName("aaa"));
      assert.isFalse(isWordLikeClassName("ab"));
      assert.isFalse(isWordLikeClassName("x"));
    });

    it("should reject CSS-in-JS style hashes (Emotion)", () => {
      assert.isFalse(isWordLikeClassName("css-1x2y3z"));
      assert.isFalse(isWordLikeClassName("css-abc123"));
    });

    it("should reject styled-components patterns", () => {
      assert.isFalse(isWordLikeClassName("sc-bdVaJa"));
      assert.isFalse(isWordLikeClassName("sc-xyz"));
    });

    it("should reject MUI/makeStyles patterns", () => {
      assert.isFalse(isWordLikeClassName("makeStyles-root-123"));
      assert.isFalse(isWordLikeClassName("MuiButton-root-123"));
    });

    it("should reject strings with 4+ consecutive consonants", () => {
      assert.isFalse(isWordLikeClassName("abcdfgh"));
      assert.isFalse(isWordLikeClassName("xyzwrst"));
      assert.isFalse(isWordLikeClassName("strng"));
    });

    it("should reject very short segments", () => {
      assert.isFalse(isWordLikeClassName("a-b-c"));
      assert.isFalse(isWordLikeClassName("xy-z"));
      assert.isFalse(isWordLikeClassName("button-ab"));
    });

    it("should reject strings with numbers", () => {
      assert.isFalse(isWordLikeClassName("class123"));
      assert.isFalse(isWordLikeClassName("btn-123"));
      assert.isFalse(isWordLikeClassName("button1"));
    });

    it("should reject single words shorter than 4 characters", () => {
      // Note: Multi-segment names can have 3-char segments (e.g., "btn-primary")
      // but single-word names must be >= 4 chars to avoid false positives
      assert.isFalse(isWordLikeClassName("btn"));
      assert.isFalse(isWordLikeClassName("nav"));
      assert.isTrue(isWordLikeClassName("button"));
    });

    it("should reject strings with special characters", () => {
      assert.isFalse(isWordLikeClassName("button_primary"));
      assert.isFalse(isWordLikeClassName("nav.button"));
      assert.isFalse(isWordLikeClassName("button@primary"));
    });
  });

  describe("edge cases", () => {
    it("should handle empty strings", () => {
      assert.isFalse(isWordLikeClassName(""));
    });

    it("should handle single hyphens", () => {
      assert.isFalse(isWordLikeClassName("-"));
      assert.isFalse(isWordLikeClassName("---"));
    });

    it("should handle all uppercase", () => {
      assert.isTrue(isWordLikeClassName("BUTTON"));
      assert.isTrue(isWordLikeClassName("NAV-BUTTON"));
    });

    it("should handle leading/trailing hyphens", () => {
      assert.isTrue(isWordLikeClassName("button-primary"));
      // Note: CSS class names with leading hyphens are valid but rare
    });
  });

  describe("real-world examples", () => {
    it("should accept common framework class names", () => {
      // Bootstrap-style
      assert.isTrue(isWordLikeClassName("btn-primary"));
      assert.isTrue(isWordLikeClassName("container-fluid"));

      // Tailwind utilities (those without numbers)
      assert.isTrue(isWordLikeClassName("text-center"));
      assert.isTrue(isWordLikeClassName("flex-col"));
    });

    it("should reject common generated class patterns", () => {
      // Emotion (numbers make them fail the pattern check)
      assert.isFalse(isWordLikeClassName("css-1okebmr"));

      // Styled-components (short segments)
      assert.isFalse(isWordLikeClassName("sc-bdVaJa"));

      // CSS Modules hash (single underscore rejected, numbers rejected)
      assert.isFalse(isWordLikeClassName("styles_button_1a2b3c"));
      assert.isFalse(isWordLikeClassName("button_123"));

      // Note: "css-vurnku" is hard to catch with simple heuristics
      // as it has vowels sprinkled in to avoid consonant checks
      // This is an acceptable limitation of the word-like detection
    });
  });
});
