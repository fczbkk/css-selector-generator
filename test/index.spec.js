import {assert} from 'chai';
import CssSelectorGenerator from './../src/css-selector-generator.js';

describe('CssSelectorGenerator', function () {

  let x;
  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
    x = new CssSelectorGenerator();
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should exist', function () {
    assert.exists(CssSelectorGenerator);
    assert.exists(x);
  });

  // TODO
  describe.skip('class selectors', function () {

    it('should use single unique class', function () {
      root.innerHTML = '<div class="aaa bbb"></div><div class="aaa ccc"></div>';
      const result = x.getSelector(root.firstChild);
      assert.equal(result, '.aaa');
    });

    it('should use combination of class names', function () {
      root.innerHTML = ''
        + '<div class="aaa bbb"></div>'
        + '<div class="aaa ccc"></div>'
        + '<div class="bbb ccc"></div>';
      const result = x.getSelector(root.firstChild);
      assert.equal(result, '.aaa.bbb');
    });

  });

  describe.skip('attribute selectors', function () {
    it('should use single unique attribute', function () {
      // TODO
    });

    it('should use combination of attributes', function () {
      // TODO
    });

    it('should use unique attribute from document', function () {
      // TODO
    });
  });

});
