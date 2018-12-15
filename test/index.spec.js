import {assert} from 'chai';
import {getCssSelector} from './../src/index';

describe('CssSelectorGenerator', function () {

  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  describe('basic scenarios', function () {

    it('should get shallow selector', function () {
      root.innerHTML = '<div class="aaa"></div>';
      const result = getCssSelector(root.firstChild, {root});
      assert.equal(result, '.aaa');
    });

    it('should get deep selector', function () {
      root.innerHTML =
        '<div id="aaa" class="aaa"><div><div class="aaa"></div></div></div>';
      const element = root.firstChild.firstChild.firstChild;
      const result = getCssSelector(element, {root});
      assert.equal(result, '#aaa > * > .aaa');
    });

  });

  describe('class selectors', function () {

    it('should get class selector', function () {
      root.innerHTML = '<div class="aaa"></div>';
      const result = getCssSelector(root.firstChild, {
        selectors: ['class'],
        root,
      });
      assert.equal(result, '.aaa');
    });

    it('should use single unique class', function () {
      root.innerHTML = '<div class="aaa bbb"></div><div class="aaa ccc"></div>';
      const result = getCssSelector(root.firstChild, {
        selectors: ['class'],
        root,
      });
      assert.equal(result, '.bbb');
    });

    it('should use combination of class names', function () {
      root.innerHTML = ''
        + '<div class="aaa bbb"></div>'
        + '<div class="aaa ccc"></div>'
        + '<div class="bbb ccc"></div>';
      const result = getCssSelector(root.firstChild, {
        selectors: ['class'],
        root,
      });
      assert.equal(result, '.aaa.bbb');
    });

  });

  describe.skip('tag prefix', function () {

    // TODO

    it('should prefix tag to each selector', function () {
      root.innerHTML = '<div class="aaa bbb"><div class="aaa"></div></div>';
      const result = getCssSelector(root.firstChild.firstChild, {
        include_tag: true
      });
      assert.equal(result, 'div.bbb > div.aaa');
    });

  });

  describe('fallback', function () {

    it('should use nth-child descendants', function () {
      root.innerHTML = '<div><div><div></div></div></div>';
      const result = getCssSelector(root.firstChild.firstChild.firstChild, {
        root,
        selectors: []
      });
      assert.equal(result, ':nth-child(1) > :nth-child(1) > :nth-child(1)');
    });

  });

});
