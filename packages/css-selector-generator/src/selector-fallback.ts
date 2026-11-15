import { getElementParents, isShadowRoot } from "./utilities-dom.js";
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
  // In a document, `:scope` matches `<html>`, so start from `:root` instead.
  if (root?.nodeType === Node.DOCUMENT_NODE) {
    root = undefined;
  }
  const parentElements = getElementParents(element, root).reverse();
  const rootIsShadowRoot = isShadowRoot(root);

  const elementsData = parentElements.map((element, index) => {
    const elementData = createElementData(
      element,
      [CSS_SELECTOR_TYPE.nthchild],
      // do not use child combinator for the first element in ShadowRoot
      rootIsShadowRoot && index === 0 ? OPERATOR.NONE : OPERATOR.CHILD,
    );
    (elementData.selectors.nthchild ?? []).forEach((selectorData) => {
      selectorData.include = true;
    });
    return elementData;
  });

  // Don't use :scope prefix for ShadowRoot since it doesn't work correctly
  const prefix = rootIsShadowRoot ? "" : root ? ":scope" : ":root";

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
