import { assert } from "chai";
import { isElement } from "../src/utilities-iselement";

describe("utilities - isElement", () => {
  it("should identify non-element", () => {
    assert.isFalse(isElement(null));
    assert.isFalse(isElement(undefined));
    assert.isFalse(isElement(""));
    assert.isFalse(isElement(0));
    assert.isFalse(isElement({}));
    assert.isFalse(isElement([]));
    assert.isFalse(
      isElement(() => {
        /* noop */
      }),
    );
  });
  it("should identify a valid element", () => {
    const element = document.createElement("div");
    assert.isTrue(isElement(element));
  });
  it("should identify a valid element inside an iframe", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const element = iframe.contentDocument.createElement("div");
    assert.isTrue(isElement(element));
    document.body.removeChild(iframe);
  });
});
