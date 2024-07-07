import { assert } from "chai";
import { getCssSelector } from "../src";
import { getIdSelector } from "../src/selector-id.js";

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
});
