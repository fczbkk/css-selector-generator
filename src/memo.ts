import {
  CssSelectors,
  CssSelectorsByType,
  CssSelectorType,
  CssSelectorTypes
} from './types';
import {SELECTOR_TYPE_GETTERS} from './utilities-selectors';

export type MemoSelectorData = Map<CssSelectorType, CssSelectors>
export type MemoElementData = Map<Element, MemoSelectorData>
export type MemoizedSelectorGetter = (element: Element, selectorTypes: CssSelectorTypes) => CssSelectorsByType

function getElementData (
  element: Element,
  memo: MemoElementData = new Map()
): MemoSelectorData {
  if (!memo.get(element)) {
    memo.set(element, new Map());
  }
  return memo.get(element);
}

function getSelectorData (
  element: Element,
  selectorType: CssSelectorType,
  memo: MemoElementData = new Map()
) {
  const elementData = getElementData(element, memo);
  if (!elementData.get(selectorType)) {
    elementData.set(selectorType, getSelectors(element, selectorType));
  }
  return elementData.get(selectorType);
}

function getSelectors (
  element: Element,
  selectorType: CssSelectorType
): CssSelectors {
  return SELECTOR_TYPE_GETTERS[selectorType](element);
}

/**
 * Creates interface for getting CSS selectors by type for an element. Results are remembered for use in later calls.
 */
export function createMemo (
  memo: MemoElementData = new Map()
): MemoizedSelectorGetter {
  return function (element: Element, selectors: CssSelectorTypes): CssSelectorsByType {
    const result = {} as CssSelectorsByType;
    selectors.forEach((selectorType) => {
      result[selectorType] = getSelectorData(element, selectorType, memo);
    });
    return result;
  };
}
