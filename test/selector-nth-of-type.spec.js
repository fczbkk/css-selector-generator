import {assert} from 'chai';
import {getNthOfTypeSelector} from '../src/selector-nth-of-type';
import {getCssSelector} from '../src';

describe('selector - nth-of-type', function () {

  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should generate nth-child selector', function () {
    root.innerHTML = '<div></div><p></p><p></p>';
    const result = getNthOfTypeSelector(root.lastChild);
    assert.equal(result.length, 1);
    assert.equal(result[0], 'p:nth-of-type(2)');
  });

  it('should not collide with tag selector', function () {
    root.innerHTML = '<div></div><p></p><p></p>';
    const result = getCssSelector(root.lastChild, {
      selectors: ['tag', 'nthoftype'],
      root,
    });
    assert.equal(result, 'p:nth-of-type(2)');
  });

  it('should not collide with `includeTag` option', function () {
    root.innerHTML = '<div></div><p></p><p></p>';
    const result = getCssSelector(root.lastChild, {
      selectors: ['nthoftype'],
      includeTag: true,
      root,
    });
    assert.equal(result, 'p:nth-of-type(2)');
  });

});
