import {
  CssSelectors,
  CssSelectorsByType,
  CssSelectorType,
  CssSelectorTypes,
} from "./types";
import {
  sanitizeSelectorNeedle,
  SELECTOR_TYPE_GETTERS,
} from "./utilities-selectors.js";
import { getIntersection } from "./utilities-data.js";

export type MemoSelectorData = Map<CssSelectorType, CssSelectors>;
export type MemoElementData = Map<Element, MemoSelectorData>;
export type MemoizedSelectorGetter = (
  needle: Element | Element[],
  selectorTypes: CssSelectorTypes,
) => CssSelectorsByType;

/**
 * Returns memoized data for element, creates new record in memo if necessary.
 */
function getElementData(
  element: Element,
  memo: MemoElementData = new Map(),
): MemoSelectorData {
  if (!memo.get(element)) {
    memo.set(element, new Map());
  }
  return memo.get(element);
}

/**
 * Returns selector data of given type for element. Generates selector data if necessary.
 */
function getSelectorData(
  element: Element,
  selectorType: CssSelectorType,
  memo: MemoElementData = new Map(),
) {
  const elementData = getElementData(element, memo);
  if (!elementData.get(selectorType)) {
    elementData.set(selectorType, getSelectors(element, selectorType));
  }
  return elementData.get(selectorType);
}

/**
 * Returns selector data of given type for element.
 */
function getSelectors(
  element: Element,
  selectorType: CssSelectorType,
): CssSelectors {
  return SELECTOR_TYPE_GETTERS[selectorType]([element]);
}

/**
 * Creates interface for getting CSS selectors by type for an element. Results are remembered for use in later calls.
 */
export function createMemo(
  memo: MemoElementData = new Map(),
): MemoizedSelectorGetter {
  return function (
    needle: Element | Element[],
    selectors: CssSelectorTypes,
  ): CssSelectorsByType {
    const result = {} as CssSelectorsByType;
    const sanitizedNeedle = sanitizeSelectorNeedle(needle);
    selectors.forEach((selectorType) => {
      result[selectorType] = getIntersection(
        sanitizedNeedle.map((element) =>
          getSelectorData(element, selectorType, memo),
        ),
      );
    });
    return result;
  };
}
