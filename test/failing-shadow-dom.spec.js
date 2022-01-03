import {assert} from 'chai'
import {getCssSelector} from '../src/index.ts'

describe('Shadow DOM', () => {
  let root
  let shadowRoot
  let shadowElement
  let shadowElementChildParagraph
  let shadowElementChildDiv

  beforeEach(() => {
    root = document.body.appendChild(document.createElement('div'))
    shadowRoot = root.attachShadow({mode: 'open'})
    shadowElement = shadowRoot.appendChild(document.createElement('div'))
    shadowElement.id = 'shadow-content'
    shadowElementChildParagraph = shadowElement.appendChild(document.createElement('p'))
    shadowElementChildDiv = shadowElement.appendChild(document.createElement('div'))
    shadowElementChildDiv.id = 'nested-shadow-host'
  })

  afterEach(() => {
    root.parentNode.removeChild(root)
  })

  it('should match shadow element within shadow root', () => {
    const result = getCssSelector(shadowElement, {root: shadowRoot})
    assert.equal(result, '#shadow-content')
  })

  it('should match shadow element\'s child paragraph within shadow root', () => {
    const result = getCssSelector(shadowElementChildParagraph, {root: shadowRoot})
    assert.equal(result, 'p')
  })

  it('should match shadow element\'s child div within shadow root', () => {
    const result = getCssSelector(shadowElementChildDiv, {root: shadowRoot})
    assert.equal(result, '#nested-shadow-host')
  })
})
