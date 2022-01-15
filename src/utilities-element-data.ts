import {
  CssSelectorGenerated,
  CssSelectorTypes,
  ElementData,
  ElementSelectorData,
  OPERATOR,
} from './types'
import {OPERATOR_DATA} from './constants'
import {getElementSelectorsByType} from './utilities-selectors'

/**
 * Creates data describing a specific selector.
 */
export function createElementSelectorData (
  selector: CssSelectorGenerated,
): ElementSelectorData {
  return {
    value: selector,
    include: false,
  }
}

/**
 * Creates data describing an element within CssSelector chain.
 */
export function createElementData (
  element: Element,
  selectorTypes: CssSelectorTypes,
): ElementData {
  const selectors = {}
  selectorTypes.forEach((selectorType) => {
    Reflect.set(
      selectors,
      selectorType,
      getElementSelectorsByType(element, selectorType)
        .map(createElementSelectorData)
    )
  })
  return {
    element,
    operator: OPERATOR_DATA[OPERATOR.NONE],
    selectors,
  }
}
