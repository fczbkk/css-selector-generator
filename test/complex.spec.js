import {assert} from 'chai'
import {getCssSelector} from '../src'
import {testSelector} from '../src/utilities-dom.ts'
import html_code from './html/complex.html'

describe('complex test', function () {

  let root

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'))
  })

  afterEach(function () {
    root.parentNode.removeChild(root)
  })

  it('should generate valid selector for every element', function () {
    root.innerHTML = html_code;
    [...root.querySelectorAll('*')].forEach((element) => {
      const selector = getCssSelector(element)
      assert.ok(testSelector(element, selector), selector)
    })
  })

})
