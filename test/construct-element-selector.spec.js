import {assert} from 'chai'
import {
  constructElementSelector,
  createElementData
} from '../src/utilities-element-data.ts'
import {CssSelectorType, OPERATOR} from '../src/types.ts'

function includeAllSelectors (elementData) {
  Object.values(elementData.selectors).forEach(
    (selectorDataList) => selectorDataList.forEach(
      (selectorData) => selectorData.include = true
    )
  )
}

describe('utilities - constructElementSelector', () => {
  let root

  beforeEach(() => {
    root = document.body.appendChild(document.createElement('div'))
  })

  afterEach(() => {
    root.parentNode.removeChild(root)
  })

  it('should include parts', () => {
    const element = document.createElement('div')
    element.setAttribute('id', 'mockId')
    element.setAttribute('class', 'mockClass1 mockClass2')
    root.appendChild(element)
    const elementData = createElementData(element, [
      CssSelectorType.id,
      CssSelectorType.tag,
      CssSelectorType.class,
    ])
    includeAllSelectors(elementData)
    const result = constructElementSelector(elementData)
    assert.equal(result, 'div#mockId.mockClass1.mockClass2')
  })

  it('should include operator', () => {
    const element = document.createElement('div')
    root.appendChild(element)
    const elementData = createElementData(element, [CssSelectorType.tag])
    elementData.operator = {type: OPERATOR.CHILD, value: ' > '}
    includeAllSelectors(elementData)
    const result = constructElementSelector(elementData)
    assert.equal(result, ' > div')
  })
})
