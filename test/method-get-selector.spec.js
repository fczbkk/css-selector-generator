import {assert} from 'chai';
import CssSelectorGenerator from './../src/css-selector-generator.js';
import complexExample from './html/complex.html';

describe('method - getSelector', function () {

  let x;
  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
    x = new CssSelectorGenerator();
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should get unique selector', function () {
    // TODO
  });

  it('should return `null` if not possible to construct selector', function () {
    // TODO
  });

  it.skip('should find selector for each element in complex example', function () {
    // TODO
    root.innerHTML = complexExample;
    root.querySelectorAll('*')
      .forEach((element) => {
        const selector = x.getSelector(element);
        assert.equal(root.querySelector(selector), element);
      });
  });

});
