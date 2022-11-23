import {sanitizeSelectorNeedle} from "../src/utilities-selectors";
import {assert} from "chai";
import {createRoot} from "./test-utilities";

describe('Utilities - selectors', () => {
  let root: Element;
  beforeEach(() => { root = createRoot(); });
  afterEach(() => { root.parentNode.removeChild(root); });

  describe('sanitizeSelectorNeedle', () => {
    it('should remove non-element inputs', () => {
      const result = sanitizeSelectorNeedle([1, false, null, 'aaa', undefined]);
      assert.equal(result.length, 0);
    });
    it('should convert single element into an array', () => {
      const result = sanitizeSelectorNeedle(root)
      assert.equal(result.length, 1);
    });
    it('should return array of elements', () => {
      root.innerHTML = '<div></div><div></div>';
      const result = sanitizeSelectorNeedle([root.children[0], root.children[1]]);
      assert.equal(result.length, 2)
    })
    it('should convert NodeList into array of elements', () => {
      root.innerHTML = '<div></div><div></div>';
      const result = sanitizeSelectorNeedle(root.querySelectorAll('div'));
      assert.equal(result.length, 2)
    });
    it('should convert HTMLCollection into array of elements', () => {
      root.innerHTML = '<form></form><form></form>';
      const result = sanitizeSelectorNeedle(document.forms);
      assert.equal(result.length, 2)
    });
  })
});
