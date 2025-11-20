import { CssSelectorGenerated } from "./types.js";
import { getIntersection } from "./utilities-data.js";

/**
 * Get nth-child selector for an element.
 */
export function getElementNthChildSelector(
  element: Element,
): CssSelectorGenerated[] {
  const siblings = element.parentElement?.children;
  if (siblings) {
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] === element) {
        return [`:nth-child(${String(i + 1)})` as CssSelectorGenerated];
      }
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
