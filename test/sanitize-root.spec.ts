import { assert } from "chai";
import { sanitizeRoot } from "../src/utilities-options.js";

describe("utilities - sanitizeRoot", () => {
  let root: Element;

  beforeEach(() => {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(() => {
    root.parentNode.removeChild(root);
  });

  it("should return provided node if it is a document", () => {
    const element = root.appendChild(document.createElement("div"));
    const result = sanitizeRoot(document, element);
    assert.equal(result, document);
  });

  it("should return provided node if it is an element", () => {
    const element = root.appendChild(document.createElement("div"));
    const result = sanitizeRoot(root, element);
    assert.equal(result, root);
  });

  it("should return provided node if it is a fragment", () => {
    const fragment = root.appendChild(document.createDocumentFragment());
    const element = fragment.appendChild(document.createElement("div"));
    const result = sanitizeRoot(fragment, element);
    assert.equal(result, fragment);
  });

  it("should return document root if not provided", () => {
    const element = root.appendChild(document.createElement("div"));
    const result = sanitizeRoot(undefined, element);
    assert.equal(result, document);
  });

  it("should return shadow root if element is part of shadow DOM", () => {
    const shadowRoot = root.attachShadow({ mode: "open" });
    const wrapper = shadowRoot.appendChild(document.createElement("div"));
    wrapper.className = "wrapper";
    const element = wrapper.appendChild(document.createElement("div"));
    element.className = "element";
    const result = sanitizeRoot(undefined, element);
    assert.equal(result, shadowRoot);
  });
});
