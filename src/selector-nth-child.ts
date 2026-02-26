import { CssSelectorGenerated } from "./types.js";
import { getIntersection } from "./utilities-data.js";

/**
 * Get nth-child selector for an element.
 */
export function getElementNthChildSelector(
  element: Element,
): CssSelectorGenerated[] {
  const parent = element.parentNode;
  const siblings = parent && "children" in parent ? parent.children : null;
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
