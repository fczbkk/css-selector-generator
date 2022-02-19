import {assert} from 'chai'
import {getCssSelector} from '../src/index.ts'

describe('options: whitelist', function () {

  let root

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'))
  })

  afterEach(function () {
    root.parentNode.removeChild(root)
  })

  it('should prioritize matching selector', function () {
    root.innerHTML = '<div class="aaa bbb"></div>'
    const result = getCssSelector(root.firstElementChild, {whitelist: ['.bbb']})
    assert.equal(result, '.bbb')
  })

  it('should understand wildcards', function () {
    root.innerHTML = '<div class="aaa abc"></div>'
    const result = getCssSelector(root.firstElementChild, {whitelist: ['.*b*']})
    assert.equal(result, '.abc')
  })

  it('should understand regexp', function () {
    root.innerHTML = '<div class="aaa bbb"></div>'
    const result = getCssSelector(root.firstElementChild, {whitelist: [/b/]})
    assert.equal(result, '.bbb')
  })

  it('should use functions as predicates', function () {
    root.innerHTML = '<div class="aaa bbb"></div>'
    const result = getCssSelector(root.firstElementChild, {
      whitelist: [(selector) => selector.endsWith('bb')]
    })
    assert.equal(result, '.bbb')
  })

  it('should work with multiple items', function () {
    root.innerHTML = '<div class="aaa bbb"></div>'
    const result = getCssSelector(
      root.firstElementChild,
      {whitelist: [/x/, /b/]}
    )
    assert.equal(result, '.bbb')
  })

  it('should include whitelisted even if matched by blacklist', function () {
    root.innerHTML = '<div class="aaa"></div>'
    const result = getCssSelector(root.firstElementChild, {
      whitelist: ['.aaa'],
      blacklist: ['.aaa']
    })
    assert.equal(result, '.aaa')
  })

  // TODO
  it.skip('should prioritise regardless of selector type', function () {
    root.innerHTML = '<p class="aaa"></p>'
    const result = getCssSelector(root.firstElementChild, {
      selectors: ['tag', 'class'],
      whitelist: ['.aaa']
    })
    assert.equal(result, '.aaa')
  })

})
