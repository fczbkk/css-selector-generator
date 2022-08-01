import {
  CssSelectorGenerated,
  CssSelectorType,
  CssSelectorTypes,
  ElementData,
  ElementSelectorData,
  OPERATOR,
} from './types.js'
import {OPERATOR_DATA, SELECTOR_PATTERN} from './constants.js'
import {getElementSelectorsByType} from './utilities-selectors.js'

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
  operator: OPERATOR = OPERATOR.NONE
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
    operator: OPERATOR_DATA[operator],
    selectors,
  }
}

/**
 * Constructs selector from element data.
 */
export function constructElementSelector (
  {selectors, operator}: ElementData
): CssSelectorGenerated {
  let pattern = [...SELECTOR_PATTERN]
  // `nthoftype` already contains tag
  if (selectors[CssSelectorType.tag] && selectors[CssSelectorType.nthoftype]) {
    pattern = pattern.filter((item) => item !== CssSelectorType.tag)
  }

  let selector = ''
  pattern.forEach((selectorType) => {
    const selectorsOfType = selectors[selectorType] || []
    selectorsOfType.forEach(({value, include}) => {
      if (include) {
        selector += value
      }
    })
  })

  return (operator.value + selector) as CssSelectorGenerated
}
