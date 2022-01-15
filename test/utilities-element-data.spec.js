import {assert} from 'chai'
import {OPERATOR_DATA} from '../src/constants.ts'
import {CssSelectorType, OPERATOR} from '../src/types.ts'
import {createElementData} from '../src/utilities-element-data.ts'

describe('utilities - createElementData', () => {
  const element = document.createElement('div')

  it('should contain input element', () => {
    const result = createElementData(element, [])
    assert.equal(result.element, element)
  })

  it('should contain "none" operator by default', () => {
    const result = createElementData(element, [])
    assert.equal(result.operator, OPERATOR_DATA[OPERATOR.NONE])
  })

  it('should only contain defined selector types', () => {
    const result = createElementData(element, [CssSelectorType.tag])
    assert.deepEqual(Object.keys(result.selectors), ['tag'])
  })

  it('should contain selectors data', () => {
    const result = createElementData(element, [CssSelectorType.tag])
    assert.deepEqual(result.selectors.tag, [{value: 'div', include: false}])
  })
})
