import { sanitizeSelectorItem } from "./utilities-selectors.js";
import { INVALID_CLASS_RE } from "./constants.js";
import { CssSelectorGenerated } from "./types.js";
import { getIntersection } from "./utilities-data.js";

/**
 * Get class selectors for an element.
 */
export function getElementClassSelectors(
  element: Element,
): CssSelectorGenerated[] {
  return (element.getAttribute("class") ?? "")
    .trim()
    .split(/\s+/)
    .filter((item) => !INVALID_CLASS_RE.test(item))
    .map((item) => `.${sanitizeSelectorItem(item)}` as CssSelectorGenerated);
}

/**
 * Get class selectors matching all elements.
 */
export function getClassSelectors(elements: Element[]): CssSelectorGenerated[] {
  const elementSelectors = elements.map(getElementClassSelectors);
  return getIntersection(elementSelectors);
}
