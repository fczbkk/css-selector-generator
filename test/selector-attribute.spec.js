import {assert} from 'chai';
import {getAttributeSelectors} from '../src/selectors';

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
    assert.include(result, '[aaa=\'bbb\']');
    assert.include(result, '[ccc=\'ddd\']');
  });

  it('should ignore blacklist', function () {
    root.innerHTML = '<div aaa="bbb" ccc="ddd"></div>';
    const options = {attribute_blacklist: ['aaa']}
    const result = getAttributeSelectors(root.firstChild, options);
    assert.lengthOf(result, 1);
    assert.notInclude(result, '[aaa=\'bbb\']');
    assert.include(result, '[ccc=\'ddd\']');
  });

  it('should prioritise whitelist', function () {
    root.innerHTML = '<div aaa="bbb" ccc="ddd"></div>';
    const options = {attribute_whitelist: ['ccc']}
    const result = getAttributeSelectors(root.firstChild, options);
    assert.lengthOf(result, 2);
    assert.equal(result[0], '[aaa=\'bbb\']')
    assert.equal(result[1], '[ccc=\'ddd\']')
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

});
