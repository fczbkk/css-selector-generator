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
    const result = getNthChildSelector(root.lastChild);
    assert.equal(result.length, 1);
    assert.equal(result[0], ':nth-child(2)');
  });

  it('should generate for BODY', function () {
    const result = getNthChildSelector(document.body);
    assert.equal(result.length, 1);
    assert.equal(result[0], ':nth-child(2)');
  });

});
