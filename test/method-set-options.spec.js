import {assert} from 'chai';
import CssSelectorGenerator from './../src/css-selector-generator.js';

describe('setOptions', function () {

  let x;
  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
    x = new CssSelectorGenerator();
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should use default options', function () {
    // TODO
  });

  it('should use custom options', function () {
    // TODO
  });

});
