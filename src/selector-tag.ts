import { sanitizeSelectorItem } from "./utilities-selectors.js";
import { CssSelector, CssSelectorGenerated } from "./types.js";
import { flattenArray } from "./utilities-data.js";

/**
 * Get tag selector for an element.
 */
export function getElementTagSelectors(
  element: Element,
): CssSelectorGenerated[] {
  return [
    sanitizeSelectorItem(element.tagName.toLowerCase()) as CssSelectorGenerated,
  ];
}

/**
 * Get tag selector for list of elements.
 */
export function getTagSelector(elements: Element[]): CssSelector[] {
  const selectors = [
    ...new Set(flattenArray(elements.map(getElementTagSelectors))),
  ];
  return selectors.length === 0 || selectors.length > 1 ? [] : [selectors[0]];
}
