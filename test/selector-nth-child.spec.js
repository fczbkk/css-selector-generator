import {assert} from 'chai';
import {getNthChildSelector} from '../src/selector-nth-child';

describe('selector - nth-child', function () {

  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should generate nth-child selector', function () {
    root.innerHTML = '<div></div><div></div>';
    assert.equal(getNthChildSelector(root.lastChild), ':nth-child(2)');
  });

  it('should generate for BODY', function () {
    assert.equal(getNthChildSelector(document.body), ':nth-child(2)');
  });

});
