import {assert} from 'chai';
import {getClassSelectors} from '../src/selector-class';

describe('selector - class', function () {

  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should generate class selectors', function () {
    root.innerHTML = '<div class="aaa bbb ccc"></div>';
    const result = getClassSelectors(root.firstChild);
    assert.lengthOf(result, 3);
    assert.include(result, '.aaa');
    assert.include(result, '.bbb');
    assert.include(result, '.ccc');
  });

  it('should return empty list if not set', function () {
    root.innerHTML = '<div></div>';
    const result = getClassSelectors(root.firstChild);
    assert.lengthOf(result, 0);
  });

  it('should ignore unnecessary whitespace', function () {
    root.innerHTML = '<div class="   aaa   bbb   ccc   "></div>';
    const result = getClassSelectors(root.firstChild);
    assert.lengthOf(result, 3);
    assert.include(result, '.aaa');
    assert.include(result, '.bbb');
    assert.include(result, '.ccc');
  });

  it('should ignore empty class name', function () {
    root.innerHTML = '<div class=""></div>';
    const result = getClassSelectors(root.firstChild);
    assert.lengthOf(result, 0);
  });

  it('should ignore class name full of whitespace', function () {
    root.innerHTML = '<div class="   "></div>';
    const result = getClassSelectors(root.firstChild);
    assert.lengthOf(result, 0);
  });

  it('should sanitize class name', function () {
    root.innerHTML = '<div class="aaa:bbb"></div>';
    const result = getClassSelectors(root.firstChild);
    assert.lengthOf(result, 1);
    assert.include(result, '.aaa\\3A bbb');
  });

  it('should ignore class names that start with a number', function () {
    root.innerHTML = '<div class="1 1a a1"></div>';
    const result = getClassSelectors(root.firstChild);
    assert.lengthOf(result, 1);
    assert.include(result, '.a1');
  });

});
