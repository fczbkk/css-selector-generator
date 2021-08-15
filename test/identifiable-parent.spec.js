import {assert} from 'chai'
import {getIdentifiableParent} from '../src/identifiable-parent'

describe('Identifiable Parent', () => {

  let root

  /**
   * Simple way to retrieve target element for test.
   * @returns {Element}
   */
  function getTargetElement () {
    return root.querySelector('[data-target]')
  }

  beforeEach(() => {
    root = document.body.appendChild(document.createElement('div'))
  })

  afterEach(() => {
    root.parentNode.removeChild(root)
  })

  it('should return `null` if not found', () => {
    root.innerHTML = '<div data-target></div>'
    const result = getIdentifiableParent(getTargetElement())
    assert.equal(result, null)
  })

  it('should find parent', () => {
    root.innerHTML = `
      <div id="mockParent" data-parent>
        <div data-target></div>
      </div>
    `
    const result = getIdentifiableParent(
      getTargetElement(),
      ['id'],
      root
    )
    const parentElement = root.querySelector('[data-parent]')
    assert.deepEqual(result, {
      foundElement: parentElement,
      selector: '#mockParent'
    })
  })

  it('should prioritize selector types by their order', () => {
    root.innerHTML = `
      <div class="mockParent" data-parent>
        <div id="ignoreThis">
          <div data-target></div>
        </div>
      </div>
    `
    const result = getIdentifiableParent(
      getTargetElement(),
      ['class', 'id'],
      root
    )
    const parentElement = root.querySelector('[data-parent]')
    assert.deepEqual(result, {
      foundElement: parentElement,
      selector: '.mockParent'
    })
  })
})
