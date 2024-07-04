import {
  createRoot,
  getTargetElement,
  getTargetElements,
  parseTestHtml,
} from "./test-utilities";
import { assert } from "chai";
import {
  getCommonParent,
  needleCandidateGenerator,
  parentsGenerator,
  testParentCandidate,
  viableParentsGenerator,
} from "../src/utilities";
import { CSS_SELECTOR_TYPE } from "../src/types.js";
import { sanitizeOptions } from "../src/utilities-options.js";

describe("Utilities", () => {
  let root: Element;
  beforeEach(() => {
    root = createRoot();
  });
  afterEach(() => {
    root.parentNode.removeChild(root);
  });

  describe("getCommonParent", () => {
    it("should get direct parent of single element", () => {
      root.innerHTML = `
        <div>
          <div class="directParent">
            <div data-target></div>
          </div>
        </div>
      `;
      const target = getTargetElement(root);
      const result = getCommonParent([target]);
      assert.equal(result.className, "directParent");
    });
    it("should get common parent of multiple elements", () => {
      root.innerHTML = `
        <div>
          <div class="commonParent">
            <div>
              <div data-target></div>
            </div>
            <div data-target></div>
          </div>
        </div>
      `;
      const target = getTargetElements(root);
      const result = getCommonParent(target);
      assert.equal(result.className, "commonParent");
    });
    it("should return `null` if there is no common parent", () => {
      const result = getCommonParent([
        document.createElement("div"),
        document.createElement("div"),
      ]);
      assert.isNull(result);
    });
  });

  describe("parentsGenerator", () => {
    it("should not yield if there are no parents", () => {
      const element = document.createElement("div");
      const generator = parentsGenerator([element], element.parentNode);
      const result = [...generator];
      assert.deepEqual(result, []);
    });
    it("should yield parents of single element", () => {
      root.innerHTML = `
        <div class="grandparent">
          <div class="parent">
            <div data-target></div>
          </div>
        </div>
      `;
      const element = getTargetElement(root);
      const generator = parentsGenerator([element], root);
      const result = [...generator];
      assert.equal(result[0].className, "parent");
      assert.equal(result[1].className, "grandparent");
    });
    it("should yield common parents of multiple elements", () => {
      const data = parseTestHtml(`
        <div><!-- name: grandparent -->
          <div><!-- name: parent -->
            <div>
              <div><!-- group: needle --></div>
            </div>
            <div><!-- group: needle --></div>
          </div>
        </div>
      `);
      const generator = parentsGenerator(data.group.needle, data.root);
      const result = [...generator];
      assert.deepEqual(result, [
        data.element.parent,
        data.element.grandparent,
        data.root,
      ]);
    });
    it("should include root if it is an element", () => {
      root.innerHTML = `<div><div></div></div>`;
      const parent = root.firstElementChild;
      const needle = parent.firstElementChild;
      const generator = parentsGenerator([needle], parent);
      const result = [...generator];
      assert.deepEqual(result, [parent]);
    });
    it("should not include root if it is not an element", () => {
      const parent = document.createDocumentFragment();
      const needle = parent.appendChild(document.createElement("div"));
      const generator = parentsGenerator([needle], parent);
      const result = [...generator];
      assert.deepEqual(result, []);
    });
  });

  describe("viableParentsGenerator", () => {
    it("should not yield if there are no viable parents", () => {
      const data = parseTestHtml(`
        <div class="aaa"><!-- group: needle --></div>
        <div class="aaa"></div>
      `);
      const generator = viableParentsGenerator(
        data.group.needle,
        ".aaa",
        data.root,
      );
      const result = [...generator];
      assert.deepEqual(result, []);
    });

    it("should yield viable parents of single element", () => {
      root.innerHTML = `
        <div class="aaa" data-target></div>
        <div class="bbb"></div>
      `;
      const needle = getTargetElements(root);
      const generator = viableParentsGenerator(needle, ".aaa", root);
      const result = [...generator];
      assert.deepEqual(result, [root]);
    });

    it("should yield viable parents of multiple elements element", () => {
      root.innerHTML = `
        <div class="aaa bbb" data-target></div>
        <div class="aaa ccc" data-target></div>
      `;
      const needle = getTargetElements(root);
      const generator = viableParentsGenerator(needle, ".aaa", root);
      const result = [...generator];
      assert.deepEqual(result, [root]);
    });

    it("should yield viable nested parent", () => {
      const data = parseTestHtml(`
        <div class="aaa"><!-- name: parent -->
          <div class="aaa"><!-- group: needle --></div>
        </div>
      `);
      const generator = viableParentsGenerator(
        data.group.needle,
        ".aaa",
        data.root,
      );
      const result = [...generator];
      assert.deepEqual(result, [data.element.parent]);
    });
  });

  describe("testParentSelector", () => {
    it("should return `false` if there is no match at all", () => {
      const data = parseTestHtml(`
        <div class="aaa"><!-- name: needle --></div>
      `);
      const result = testParentCandidate(
        data.element.needle,
        ".xxx",
        data.root,
      );
      assert.isFalse(result);
    });
    it("should return `false` if it matches other than non-child elements within root", () => {
      const data = parseTestHtml(`
        <div class="aaa"><!-- name: needle --></div>
        <div class="aaa"></div>
      `);
      const result = testParentCandidate(
        data.element.needle,
        ".aaa",
        data.root,
      );
      assert.isFalse(result);
    });
    it("should return `true` if it matches only needle and some of its children", () => {
      const data = parseTestHtml(`
        <div class="aaa"><!-- name: needle -->
          <div class="aaa"></div>
        </div>
      `);
      const result = testParentCandidate(
        data.element.needle,
        ".aaa",
        data.root,
      );
      assert.isTrue(result);
    });
    it("should return `true` if it matches needle uniquely", () => {
      const data = parseTestHtml(`
        <div class="aaa"><!-- name: needle --></div>
      `);
      const result = testParentCandidate(
        data.element.needle,
        ".aaa",
        data.root,
      );
      assert.isTrue(result);
    });
    it("should return `false` if it matches also parents of needle", () => {
      const data = parseTestHtml(`
        <div class="aaa">
          <div class="aaa"><!-- name: needle --></div>
        </div>
      `);
      const result = testParentCandidate(
        data.element.needle,
        ".aaa",
        data.root,
      );
      assert.isFalse(result);
    });
  });

  describe("needleCandidateGenerator", () => {
    it("should generate simple needle candidates", () => {
      const data = parseTestHtml(`
        <div class="aaa bbb"><!-- group: needle --></div>
      `);
      const options = sanitizeOptions(data.group.needle[0], {
        root: data.root,
        selectors: ["class"],
      });
      const generator = needleCandidateGenerator(
        data.group.needle,
        [CSS_SELECTOR_TYPE.class],
        options,
      );
      const result = [...generator];
      assert.deepEqual(result, [".aaa", ".bbb", ".aaa.bbb"]);
    });
    it("should respect selector types order", () => {
      const data = parseTestHtml(`
        <div class="aaa" id="bbb"><!-- group: needle --></div>
      `);
      const options = sanitizeOptions(data.group.needle[0], {
        root: data.root,
        selectors: ["class", "id"],
      });
      const generator = needleCandidateGenerator(
        data.group.needle,
        [CSS_SELECTOR_TYPE.class, CSS_SELECTOR_TYPE.id],
        options,
      );
      const result = [...generator];
      assert.deepEqual(result, [".aaa", "#bbb", "#bbb.aaa"]);
    });
  });
});
