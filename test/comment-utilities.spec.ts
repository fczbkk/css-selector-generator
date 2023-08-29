import {parseComment} from "./comment-utilities";
import {assert} from "chai";

// TODO multiline records

describe.only('Comment Utilities', () => {
  describe('parseComment', () => {
    it('should parse empty comment', () => {
      const result = parseComment('')
      assert.deepEqual(result, {name: [], expect: []})
    });
    describe('name', () => {
      it('should parse a name', () => {
        const {name} = parseComment('name: mock name')
        assert.deepEqual(name, ['mock name'])
      });
      it('should parse a multiple name properties', () => {
        const {name} = parseComment('name: first name; name: second name')
        assert.deepEqual(name, ['first name', 'second name'])
      });
      it('should parse a multiple names within single property', () => {
        const {name} = parseComment('name: first name / second name')
        assert.deepEqual(name, ['first name', 'second name'])
      });
    })
    describe('expect', () => {
      it('should parse expectation', () => {
        const {expect} = parseComment('expect: mock name / .aaa')
        assert.deepEqual(expect, [{name: 'mock name', selector: '.aaa'}])
      });
      it('should generate random name if expectation does not include one', () => {
        const {name, expect} = parseComment('expect: .aaa')
        const randomName = name[0]
        assert.isDefined(randomName)
        assert.deepEqual(expect, [{name: randomName, selector: '.aaa'}])
      });
      it.skip('should reuse existing name if expectation does not include one', () => {
        const {name, expect} = parseComment('name: mock name; expect: .aaa')
        assert.deepEqual(expect, [{name: 'mock name', selector: '.aaa'}])
      });
    })
    describe('other', () => {
      it('should ignore unknown properties', () => {
        const result = parseComment('xxx: first invalid property; yyy: second invalid property; name: valid property')
        assert.deepEqual(result,{name: ['valid property'], expect: []})
      });
    })
  })
})
