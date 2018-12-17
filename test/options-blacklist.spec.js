import {assert} from 'chai';
import {getCssSelector} from '../src/index.js';

describe('options: blacklist', function () {

  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should ignore matching selector', function () {
    root.innerHTML = '<div class="aaa bbb"></div>';
    const result = getCssSelector(root.firstChild, {blacklist: ['.aaa']});
    assert.equal(result, '.bbb');
  });

  it('should understand wildcards', function () {
    root.innerHTML = '<div class="aaa abc"></div>';
    const result = getCssSelector(root.firstChild, {blacklist: ['.*a*']});
    assert.equal(result, '.abc');
  });

  it('should understand regexp', function () {
    root.innerHTML = '<div class="aaa bbb"></div>';
    const result = getCssSelector(root.firstChild, {blacklist: [/a/]});
    assert.equal(result, '.bbb');
  });

  it('should work with multiple items', function () {
    root.innerHTML = '<div class="aaa bbb"></div>';
    const result = getCssSelector(root.firstChild, {blacklist: [/x/, /a/]});
    assert.equal(result, '.bbb');
  });

});
