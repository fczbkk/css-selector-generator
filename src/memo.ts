import {
  CssSelectors,
  CssSelectorsByType,
  CssSelectorType,
  CssSelectorTypes
} from './types'
import {SELECTOR_TYPE_GETTERS} from './utilities-selectors.js'

export type MemoSelectorData = Map<CssSelectorType, CssSelectors>
export type MemoElementData = Map<Element[], MemoSelectorData>
export type MemoizedSelectorGetter =
  (elements: Element[], selectorTypes: CssSelectorTypes) => CssSelectorsByType

/**
 * Returns memoized data for element, creates new record in memo if necessary.
 */
function getElementData (
  elements: Element[],
  memo: MemoElementData = new Map()
): MemoSelectorData {
  if (!memo.get(elements)) {
    memo.set(elements, new Map())
  }
  return memo.get(elements)
}

/**
 * Returns selector data of given type for element. Generates selector data if necessary.
 */
function getSelectorData (
  elements: Element[],
  selectorType: CssSelectorType,
  memo: MemoElementData = new Map()
) {
  const elementData = getElementData(elements, memo)
  if (!elementData.get(selectorType)) {
    elementData.set(selectorType, getSelectors(elements, selectorType))
  }
  return elementData.get(selectorType)
}

/**
 * Returns selector data of given type for element.
 */
function getSelectors (
  elements: Element[],
  selectorType: CssSelectorType
): CssSelectors {
  return SELECTOR_TYPE_GETTERS[selectorType](elements)
}

/**
 * Creates interface for getting CSS selectors by type for an element. Results are remembered for use in later calls.
 */
export function createMemo (
  memo: MemoElementData = new Map()
): MemoizedSelectorGetter {
  return function (
    elements: Element[],
    selectors: CssSelectorTypes
  ): CssSelectorsByType {
    const result = {} as CssSelectorsByType
    selectors.forEach((selectorType) => {
      result[selectorType] = getSelectorData(elements, selectorType, memo)
    })
    return result
  }
}
