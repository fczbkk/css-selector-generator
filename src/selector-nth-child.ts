import { isElement } from "./utilities-iselement.js";
import { CssSelectorGenerated } from "./types.js";
import { getIntersection } from "./utilities-data.js";

/**
 * Get nth-child selector for an element.
 */
export function getElementNthChildSelector(
  element: Element,
): CssSelectorGenerated[] {
  const parent = element.parentNode;

  if (parent) {
    const siblings = Array.from(parent.childNodes).filter(isElement);
    const elementIndex = siblings.indexOf(element);
    if (elementIndex > -1) {
      return [
        `:nth-child(${String(elementIndex + 1)})` as CssSelectorGenerated,
      ];
    }
  }

  return [];
}

/**
 * Get nth-child selector matching all elements.
 */
export function getNthChildSelector(
  elements: Element[],
): CssSelectorGenerated[] {
  return getIntersection(elements.map(getElementNthChildSelector));
}
