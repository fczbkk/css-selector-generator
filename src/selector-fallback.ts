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
export function getElementFallbackSelector(
  element: Element,
  root?: ParentNode,
): CssSelector {
  const parentElements = getElementParents(element, root).reverse();
  const isShadowRoot = root instanceof ShadowRoot;

  const elementsData = parentElements.map((element, index) => {
    const elementData = createElementData(
      element,
      [CSS_SELECTOR_TYPE.nthchild],
      // do not use child combinator for the first element in ShadowRoot
      isShadowRoot && index === 0 ? OPERATOR.NONE : OPERATOR.CHILD,
    );
    (elementData.selectors.nthchild ?? []).forEach((selectorData) => {
      selectorData.include = true;
    });
    return elementData;
  });

  // Don't use :scope prefix for ShadowRoot since it doesn't work correctly
  const prefix = isShadowRoot ? "" : root ? ":scope" : ":root";

  return [prefix, ...elementsData.map(constructElementSelector)].join("");
}

/**
 * Creates chain of :nth-child selectors from root to the elements.
 */
export function getFallbackSelector(
  elements: Element[],
  root?: ParentNode,
): CssSelector {
  return elements
    .map((element) => getElementFallbackSelector(element, root))
    .join(SELECTOR_SEPARATOR);
}
