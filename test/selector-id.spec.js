import {assert} from 'chai';
import {getIdSelector} from '../src/selectors';

describe('selector - ID', function () {

  let root;

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'));
  });

  afterEach(function () {
    root.parentNode.removeChild(root);
  });

  it('should generate ID selector', function () {
    root.innerHTML = '<div id="aaa"></div>';
    assert.equal(getIdSelector(root.firstChild), '#aaa');
  });

  it('should return `null` if ID is not set', function () {
    root.innerHTML = '<div></div>';
    assert.equal(getIdSelector(root.firstChild), null);
  });

  it('should escape special characters', function () {
    root.innerHTML = '<div id="aaa+bbb"></div>';
    assert.equal(getIdSelector(root.firstChild), '#aaa\\+bbb');
  });

  it.skip('should escape UTF8 characters', function () {
    // TODO
    root.innerHTML = '<div id="aaa✓bbb"></div>';
    assert.equal(getIdSelector(root.firstChild), 'aaa\\u2713bbb');
  });

  it('should escape colon character', function () {
    root.innerHTML = '<div id="aaa:bbb"></div>';
    assert.equal(getIdSelector(root.firstChild), '#aaa\\3A bbb');
  });

  it('should ignore ID beginning with a number', function () {
    root.innerHTML = '<div id="1aaa"></div>';
    assert.equal(getIdSelector(root.firstChild), null);
  });

  it('should ignore non-unique ID attribute', function () {
    root.innerHTML = '<div id="aaa"></div><div id="aaa"></div>';
    assert.equal(getIdSelector(root.firstChild), null);
  });

  it('should ignore empty ID attribute', function () {
    root.innerHTML = '<div id=""></div>';
    assert.equal(getIdSelector(root.firstChild), null);
  });

  it('should ignore ID attribute containing white-space', function () {
    root.innerHTML = '<div id="aaa bbb"></div>';
    assert.equal(getIdSelector(root.firstChild), null);
  });

  it('should ignore ID attribute containing only white-space', function () {
    root.innerHTML = '<div id="   "></div>';
    assert.equal(getIdSelector(root.firstChild), null);
  });

  it('should ignore blacklisted ID defined as string', function () {
    const options = {id_blacklist: ['aaa']};
    root.innerHTML = '<div id="aaa"></div>';
    assert.equal(getIdSelector(root.firstChild, options), null);
  });

  it('should ignore blacklisted ID defined as regex', function () {
    const options = {id_blacklist: [/a+/]};
    root.innerHTML = '<div id="aaa"></div>';
    assert.equal(getIdSelector(root.firstChild, options),  null);
  });

});
