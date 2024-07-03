import { assert } from "chai";
import { sanitizeSelectorItem } from "../src/utilities-selectors.js";

describe("utilities - sanitizeSelectorItem", function () {
  it("should leave content as is", function () {
    assert.equal(sanitizeSelectorItem("aaa"), "aaa");
  });

  it("should escape colon", function () {
    assert.equal(sanitizeSelectorItem("aaa:bbb"), "aaa\\:bbb");
  });

  it("should escape special characters", function () {
    assert.equal(sanitizeSelectorItem("aaa[bbb=ccc]"), "aaa\\[bbb\\=ccc\\]");
  });
});
