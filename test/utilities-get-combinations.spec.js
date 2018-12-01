import {assert} from 'chai';
import {getCombinations} from '../src/utilities';

describe('utilities - getCombinations', function () {

  it('should get all possible combinations', function () {
    const result = getCombinations(['a', 'b', 'c']);
    const expectations = ['a', 'b', 'c', 'ab', 'ac', 'bc', 'abc'];
    expectations.forEach((item) => {
      assert.include(result, item);
    });
    assert.notInclude(result, '');
    assert.notInclude(result, 'aa');
  });

  it('should sort results from shortest to longest', function () {
    const result = getCombinations(['a', 'b', 'c']);
    assert(result.pop(), 'abc');
  });

});
