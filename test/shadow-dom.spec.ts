import { assert } from "chai";
import { getCssSelector } from "../src";
import { getIdSelector } from "../src/selector-id.js";
import { testSelector } from "../src/utilities-dom";

describe("Shadow DOM", () => {
  let root: Element;
  let shadowRoot: ShadowRoot;
  let shadowElement: Element;

  beforeEach(() => {
    root = document.body.appendChild(document.createElement("div"));
    shadowRoot = root.attachShadow({ mode: "open" });
    shadowElement = shadowRoot.appendChild(document.createElement("div"));
    shadowElement.className = "shadowElement";
  });

  afterEach(() => {
    root.parentNode.removeChild(root);
  });

  it("should match shadow element within shadow root", () => {
    const result = getCssSelector(shadowElement, { root: shadowRoot });
    assert.equal(result, ".shadowElement");
  });

  it("should match shadow element without specifying root", () => {
    const result = getCssSelector(shadowElement);
    assert.equal(result, ".shadowElement");
  });

  it("should get ID of element within shadow root", () => {
    shadowElement.id = "shadowElement";
    const result = getIdSelector([shadowElement])[0];
    assert.equal(result, "#shadowElement");
  });

  it("should not generate invalid selectors for shadow root children without identifiers", () => {
    // force creation of a fallback selector
    shadowRoot.replaceChildren();
    const testElement = shadowRoot.appendChild(document.createElement("div"));
    shadowRoot.appendChild(document.createElement("div"));

    const result = getCssSelector(testElement, { root: shadowRoot });

    assert.notMatch(result, />\s*>/); // consecutive child combinators
    assert.notMatch(result, />\s*$/); // trailing child combinator
    assert.ok(testSelector([testElement], result, shadowRoot));
  });
});
