import {
  CSS_SELECTOR_TYPE,
  CssSelectorGenerated,
  CssSelectorTypes,
  ElementData,
  ElementSelectorData,
  OPERATOR,
  OperatorValue,
} from "./types.js";
import { SELECTOR_PATTERN } from "./constants.js";
import { getElementSelectorsByType } from "./utilities-selectors.js";

/**
 * Creates data describing a specific selector.
 */
export function createElementSelectorData(
  selector: CssSelectorGenerated,
): ElementSelectorData {
  return {
    value: selector,
    include: false,
  };
}

/**
 * Creates data describing an element within CssSelector chain.
 */
export function createElementData(
  element: Element,
  selectorTypes: CssSelectorTypes,
  operator: OperatorValue = OPERATOR.NONE,
): ElementData {
  const selectors = {};
  selectorTypes.forEach((selectorType) => {
    Reflect.set(
      selectors,
      selectorType,
      getElementSelectorsByType(element, selectorType).map(
        createElementSelectorData,
      ),
    );
  });
  return {
    element,
    operator,
    selectors,
  };
}

/**
 * Constructs selector from element data.
 */
export function constructElementSelector({
  selectors,
  operator,
}: ElementData): CssSelectorGenerated {
  let pattern = [...SELECTOR_PATTERN];
  // `nthoftype` already contains tag
  if (
    selectors[CSS_SELECTOR_TYPE.tag] &&
    selectors[CSS_SELECTOR_TYPE.nthoftype]
  ) {
    pattern = pattern.filter((item) => item !== CSS_SELECTOR_TYPE.tag);
  }

  let selector = "";
  pattern.forEach((selectorType) => {
    const selectorsOfType = selectors[selectorType] ?? [];
    selectorsOfType.forEach(({ value, include }) => {
      if (include) {
        selector += value;
      }
    });
  });

  return (operator + selector) as CssSelectorGenerated;
}
