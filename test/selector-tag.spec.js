import {assert} from 'chai';
import {getTagSelector} from '../src/selector-tag';

describe('selector - tag', function () {

  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should generate tag selector', function () {
    root.innerHTML = '<div></div>';
    const element = root.firstChild;
    const selector = getTagSelector(element);
    assert.equal(selector, 'div');
    assert.equal(root.querySelector(selector), element);
  });

  it('should generate selector for namespaced element', function () {
    root.innerHTML = '<aaa:bbb></aaa:bbb>';
    const element = root.firstChild;
    const selector = getTagSelector(element);
    assert.equal(selector, 'aaa\\3A bbb');
    assert.equal(root.querySelector(selector), element);
  });

});
