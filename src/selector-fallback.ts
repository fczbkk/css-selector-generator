import { getElementParents } from "./utilities-dom.js";
import { SELECTOR_SEPARATOR } from "./constants.js";
import { CSS_SELECTOR_TYPE, CssSelector, OPERATOR } from "./types.js";
import {
  constructElementSelector,
  createElementData,
} from "./utilities-element-data.js";

/**
 * Creates fallback selector for single element.
 */
export function getElementFallbackSelector(element: Element): CssSelector {
  const parentElements = getElementParents(element).reverse();
  const elementsData = parentElements.map((element) => {
    const elementData = createElementData(
      element,
      [CSS_SELECTOR_TYPE.nthchild],
      OPERATOR.CHILD,
    );
    elementData.selectors.nthchild.forEach((selectorData) => {
      selectorData.include = true;
    });
    return elementData;
  });

  return [":root", ...elementsData.map(constructElementSelector)].join("");
}

/**
 * Creates chain of :nth-child selectors from root to the elements.
 */
export function getFallbackSelector(elements: Element[]): CssSelector {
  return elements.map(getElementFallbackSelector).join(SELECTOR_SEPARATOR);
}
