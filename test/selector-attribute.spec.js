import {assert} from 'chai';
import {getAttributeSelectors} from '../src/selector-attribute';

describe('selector - attribute', function () {

  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should generate attribute selectors', function () {
    root.innerHTML = '<div aaa="bbb" ccc="ddd"></div>';
    const result = getAttributeSelectors(root.firstChild);
    assert.lengthOf(result, 2);
    assert.include(result, "[aaa='bbb']");
    assert.include(result, '[ccc=\'ddd\']');
  });

  it('should ignore ID attribute', function () {
    root.innerHTML = '<div id="aaa"></div>';
    const result = getAttributeSelectors(root.firstChild);
    assert.lengthOf(result, 0);
  });

  it('should ignore class attribute', function () {
    root.innerHTML = '<div class="aaa"></div>';
    const result = getAttributeSelectors(root.firstChild);
    assert.lengthOf(result, 0);
  });

  it('should sanitize attribute values', function () {
    root.innerHTML = '<div aaa="bbb ccc"></div>';
    const result = getAttributeSelectors(root.firstChild);
    assert.include(result, '[aaa=\'bbb\\ ccc\']');
  });

  it('should quote attribute values', function () {
    root.innerHTML = '<div aaa="bbb:ccc"></div>';
    const result = getAttributeSelectors(root.firstChild);
    assert.include(result, '[aaa=\'bbb\\3A ccc\']');
  });

  it('should ignore Angular attributes', function () {
    root.innerHTML = '<div ng-aaa="bbb"></div>';
    const result = getAttributeSelectors(root.firstChild);
    assert.equal(result.length, 0);
  });

});
