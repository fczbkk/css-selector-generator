import {assert} from 'chai';
import CssSelectorGenerator from './../src/css-selector-generator.js';

describe('utilities - testSelector', function () {

  let x;
  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
    x = new CssSelectorGenerator();
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should test selector', function () {
    // TODO
  });

});
