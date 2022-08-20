import {assert} from 'chai'
import {
  getClosestIdentifiableParentBySpecificity,
} from '../src/utilities-selectors.js'
import {CssSelectorType} from '../src/types.js'
import {sanitizeOptions} from '../src/utilities-options.js'

describe('utilities - selectors', () => {

  let root: HTMLElement

  beforeEach(function () {
    root = document.body.appendChild(document.createElement('div'))
  })

  afterEach(function () {
    root?.remove()
  })

  describe.skip('getClosestIdentifiableParentBySpecificity', () => {
    it('should return `null` if element has no parents', () => {
      const options = sanitizeOptions(root)
      const result = getClosestIdentifiableParentBySpecificity([root], root, '', options)
      assert.equal(result, null)
    })

    it('should return parent element', () => {
      root.innerHTML = '<div></div>'
      const element = root.firstElementChild
      const options = sanitizeOptions(element, {selectors: ['tag']})
      const result = getClosestIdentifiableParentBySpecificity([element], root, '', options)
      assert.equal(result, {foundElements: [root], selector: 'div'})
    })

    it('should prioritise further parent in favor of selectors order', () => {
      root.innerHTML = `
        <div class="furtherParent">
          <div id="closerParent">
            <div></div>
          </div>
        </div>
       `
      const element = root.firstElementChild.firstElementChild.firstElementChild
      const options = sanitizeOptions(element, {selectors: ['class', 'id']})
      const result = getClosestIdentifiableParentBySpecificity([element], root, '', options)
      assert.equal(result, {foundElements: [root.firstElementChild], selector: '.furtherParent'})
    })

  })
})
