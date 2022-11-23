import {
  createRoot,
  getTargetElement,
  getTargetElements
} from "./test-utilities";
import {assert} from "chai";
import {getCommonParent} from "../src/utilities";

describe('Utilities', () => {

  describe('getCommonParent', () => {
    let root: Element;
    beforeEach(() => { root = createRoot(); });
    afterEach(() => { root.parentNode.removeChild(root); });

    it('should get direct parent of single element', () => {
      root.innerHTML = `
        <div>
          <div class="directParent">
            <div data-target></div>
          </div>
        </div>
      `
      const target = getTargetElement(root);
      const result = getCommonParent([target]);
      assert.equal(result.className, 'directParent')
    });
    it('should get common parent of multiple elements', () => {
      root.innerHTML = `
        <div>
          <div class="commonParent">
            <div>
              <div data-target></div>
            </div>
            <div data-target></div>
          </div>
        </div>
      `
      const target = getTargetElements(root);
      const result = getCommonParent(target);
      assert.equal(result.className, 'commonParent')
    });
    it('should return `null` if there is no common parent', () => {
      const result = getCommonParent([
        document.createElement('div'),
        document.createElement('div')
      ])
      assert.isNull(result)
    });
  })

})
