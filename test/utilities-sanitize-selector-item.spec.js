import {assert} from 'chai';
import {sanitizeSelectorItem} from '../src/utilities-selectors';

describe('utilities - sanitizeSelectorItem', function () {

  it('should leave content as is', function () {
    assert.equal(sanitizeSelectorItem('aaa'), 'aaa');
  });

  it('should escape colon', function () {
    assert.equal(sanitizeSelectorItem('aaa:bbb'), 'aaa\\3A bbb');
  });

  it('should escape special characters', function () {
    assert.equal(sanitizeSelectorItem('aaa[bbb=ccc]'), 'aaa\\[bbb\\=ccc\\]');
  });

  it('should escape letters with accents', function () {
    assert.equal(sanitizeSelectorItem('aáä'), 'a\\E1\\E4');
  });

  it('should escape double unicode characters', function () {
    assert.equal(sanitizeSelectorItem('😀'), '\\uD83D\\uDE00');
  });

});
