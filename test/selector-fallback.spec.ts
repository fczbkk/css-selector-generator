import { assert } from "chai";
import { getFallbackSelector } from "../src/selector-fallback.js";
import { testMultiSelector, testSelector } from "../src/utilities-dom.js";

describe("selector - fallback", function () {
  let root: Element;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement("div"));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it("should produce simple selector", () => {
    root.innerHTML = "<div></div>";
    const needleElement = root.firstElementChild;
    const result = getFallbackSelector([needleElement]);
    assert.ok(testSelector([needleElement], result, root));
  });

  it("should produce nested selector", () => {
    root.innerHTML = "<div><div><div></div></div></div>";
    const needleElement =
      root.firstElementChild.firstElementChild.firstElementChild;
    const result = getFallbackSelector([needleElement]);
    assert.ok(testSelector([needleElement], result, root));
  });

  it("should produce selector beside similar elements", () => {
    root.innerHTML = "<div><div><div></div></div></div>";
    const needleElement = root.firstElementChild;
    const result = getFallbackSelector([needleElement]);
    assert.ok(testSelector([needleElement], result, root));
  });

  // https://developer.mozilla.org/en-US/docs/Web/API/element/querySelector#the_entire_hierarchy_counts
  it("should consider entire hierarchy", () => {
    root.innerHTML = `
      <div>
        <div>haystack
          <div>needle</div>
          <div>
            <div>this should not match</div>
          </div>
        </div>
      </div>
    `;
    const haystackElement = root.firstElementChild.firstElementChild;
    const needleElement =
      root.firstElementChild.firstElementChild.firstElementChild;
    const result = getFallbackSelector([needleElement]);
    assert.ok(testSelector([needleElement], result, haystackElement));
  });

  it("should produce selector for multiple elements", () => {
    root.innerHTML = `
      <div></div>
      <div></div>
      <div></div>
    `;
    const needleElements = [...root.querySelectorAll("div")];
    const result = getFallbackSelector(needleElements);
    needleElements.forEach((element) => {
      assert.ok(testMultiSelector(element, result, root));
    });
  });

  it("should use :scope when the root option is set", () => {
    root.innerHTML = `
      <div>root
        <div>
          <div>needle</div>
        </div>
      </div>
    `;
    const rootElement = root.firstElementChild;
    const needleElement = rootElement.firstElementChild.firstElementChild;
    const result = getFallbackSelector([needleElement], rootElement);
    assert.ok(testSelector([needleElement], result, rootElement));
    assert.equal(result, ":scope > :nth-child(1) > :nth-child(1)");
  });

  it("should generate correct nth-child path for nested elements", () => {
    root.innerHTML = `
      <div>
        <div></div>
        <div></div>
        <div>
          <span></span>
        </div>
      </div>
    `;
    const targetElement = root.querySelector("span");
    const result = getFallbackSelector([targetElement], root);
    assert.ok(testSelector([targetElement], result, root));
    assert.equal(result, ":scope > :nth-child(1) > :nth-child(3) > :nth-child(1)");
  });

  it("should work with elements in iframe", () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument;
    iframeDoc.body.innerHTML = `
      <div>
        <div></div>
        <span></span>
      </div>
    `;

    const container = iframeDoc.body;
    const targetElement = iframeDoc.querySelector("span");
    const result = getFallbackSelector([targetElement], container);

    document.body.removeChild(iframe);

    assert.ok(testSelector([targetElement], result, container));
    assert.equal(result, ":scope > :nth-child(1) > :nth-child(2)");
  });
});
