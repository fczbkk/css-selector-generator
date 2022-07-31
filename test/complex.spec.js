import {assert} from 'chai'
import {getCssSelector} from '../src/index.ts'
import {testSelector} from '../src/utilities-dom.ts'
import complexHTML from './html/complex.html'

describe('complex test', function () {

  let root

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'))
  })

  afterEach(function () {
    root.parentNode.removeChild(root)
  })

  it('should generate valid selector for every element', function () {
    root.innerHTML = complexHTML;
    [...root.querySelectorAll('*')].forEach((element) => {
      const selector = getCssSelector(element)
      assert.ok(testSelector([element], selector), selector)
    })
  })

})
