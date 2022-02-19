import {assert} from 'chai'
import {getCssSelector} from '../src/index.ts'

describe('options: blacklist', function () {

  let root

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'))
  })

  afterEach(function () {
    root.parentNode.removeChild(root)
  })

  it('should ignore matching selector', function () {
    root.innerHTML = '<div class="aaa bbb"></div>'
    const result = getCssSelector(root.firstElementChild, {blacklist: ['.aaa']})
    assert.equal(result, '.bbb')
  })

  it('should understand wildcards', function () {
    root.innerHTML = '<div class="aaa abc"></div>'
    const result = getCssSelector(root.firstElementChild, {blacklist: ['.*a*']})
    assert.equal(result, '.abc')
  })

  it('should understand regexp', function () {
    root.innerHTML = '<div class="aaa bbb"></div>'
    const result = getCssSelector(root.firstElementChild, {blacklist: [/a/]})
    assert.equal(result, '.bbb')
  })

  it('should use functions as predicates', function () {
    root.innerHTML = '<div class="aaa bbb"></div>'
    const result = getCssSelector(root.firstElementChild, {
      blacklist: [(selector) => selector.endsWith('aa')]
    })
    assert.equal(result, '.bbb')
  })

  it('should work with multiple items', function () {
    root.innerHTML = '<div class="aaa bbb"></div>'
    const result = getCssSelector(
      root.firstElementChild,
      {blacklist: [/x/, /a/]}
    )
    assert.equal(result, '.bbb')
  })

})
