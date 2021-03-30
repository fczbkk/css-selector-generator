import {
  CssSelectors,
  CssSelectorsByType,
  CssSelectorType,
  CssSelectorTypes
} from './types';
import {SELECTOR_TYPE_GETTERS} from './utilities-selectors';

type MemoSelectorData = Map<CssSelectorType, CssSelectors>
type MemoElementData = Map<Element, MemoSelectorData>

/**
 * Creates interface for getting CSS selectors by type for an element. Results are remembered for use in later calls.
 */
export function createMemo (memo: MemoElementData = new Map()) {

  function getElementData (element: Element): MemoSelectorData {
    if (!memo.get(element)) {
      memo.set(element, new Map());
    }
    return memo.get(element);
  }

  function getSelectorData (element: Element, selectorType: CssSelectorType) {
    const elementData = getElementData(element);
    if (!elementData.get(selectorType)) {
      elementData.set(selectorType, getSelectors(element, selectorType));
    }
    return elementData.get(selectorType);
  }

  function getSelectors (element: Element, selectorType: CssSelectorType): CssSelectors {
    return SELECTOR_TYPE_GETTERS[selectorType](element);
  }

  return function (element: Element, selectors: CssSelectorTypes): CssSelectorsByType {
    const result = {} as CssSelectorsByType;
    selectors.forEach((selectorType) => {
      result[selectorType] = getSelectorData(element, selectorType);
    });
    return result;
  };
}
