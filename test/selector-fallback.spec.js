import {assert} from 'chai';
import {getFallbackSelector} from '../src/selector-fallback.js';
import {testSelector} from '../src/utilities-dom.js';

describe('selector - fallback', function () {

  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should produce simple selector', () => {
    root.innerHTML = '<div></div>';
    const needleElement = root.firstChild;
    const result = getFallbackSelector(needleElement, root);
    assert.ok(testSelector(needleElement, result, root));
  });

  it('should produce nested selector', () => {
    root.innerHTML = '<div><div><div></div></div></div>';
    const needleElement = root
      .firstElementChild
      .firstElementChild
      .firstElementChild;
    const result = getFallbackSelector(needleElement, root);
    assert.ok(testSelector(needleElement, result, root));
  });

  it('should produce selector beside similar elements', () => {
    root.innerHTML = '<div><div><div></div></div></div>';
    const needleElement = root.firstElementChild;
    const result = getFallbackSelector(needleElement, root);
    assert.ok(testSelector(needleElement, result, root));
  });

  // https://developer.mozilla.org/en-US/docs/Web/API/element/querySelector#the_entire_hierarchy_counts
  it('should consider entire hierarchy', () => {
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
    const haystackElement = root
      .firstElementChild
      .firstElementChild;
    const needleElement = root
      .firstElementChild
      .firstElementChild
      .firstElementChild;
    const result = getFallbackSelector(needleElement, haystackElement);
    assert.ok(testSelector(needleElement, result, haystackElement));
  });
});
