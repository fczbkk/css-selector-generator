import { sanitizeSelectorItem } from "./utilities-selectors.js";
import { CssSelector, CssSelectorGenerated, CssSelectorGeneratorOptions } from "./types.js";
import { flattenArray } from "./utilities-data.js";

/**
 * Get tag selector for an element.
 */
export function getElementTagSelectors(
  element: Element,
  _options?: CssSelectorGeneratorOptions,
): CssSelectorGenerated[] {
  return [
    sanitizeSelectorItem(element.tagName.toLowerCase()) as CssSelectorGenerated,
  ];
}

/**
 * Get tag selector for list of elements.
 */
export function getTagSelector(
  elements: Element[],
  options?: CssSelectorGeneratorOptions,
): CssSelector[] {
  const selectors = [
    ...new Set(flattenArray(elements.map((el) => getElementTagSelectors(el, options)))),
  ];
  return selectors.length === 0 || selectors.length > 1 ? [] : [selectors[0]];
}
