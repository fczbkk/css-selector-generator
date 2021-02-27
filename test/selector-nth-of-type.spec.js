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

  it('should not throw error if tag and nthoftype used', function () {
    root.innerHTML = '<ul><li><a></a></li><li><a></a><ul><li></li><li></li></ul></li></ul>';
    const result = getCssSelector(root.querySelector('a'), {
      selectors: ['tag', 'nthoftype'],
      root,
    });
    assert.equal(result, ':nth-child(1) > :nth-child(1) > :nth-child(1)');
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

  it('should not throw for element without parent', function () {
    const element = document.createElement('div');
    const fn = function () {
      getCssSelector(element, {
        selectors: ['nthoftype'],
        root,
      });
    };
    assert.doesNotThrow(fn);
  });

  it('should not throw for element directly in document', function () {
    const element = document.querySelector('html');
    const fn = function () {
      getCssSelector(element, {
        selectors: ['nthoftype'],
        root,
      });
    };
    assert.doesNotThrow(fn);
  });

});
