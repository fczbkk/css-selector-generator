import { sanitizeSelectorItem } from "./utilities-selectors.js";
import { INVALID_ID_RE } from "./constants.js";
import { testSelector } from "./utilities-dom.js";
import { CssSelectorGenerated, CssSelectorGeneratorOptions } from "./types.js";

/**
 * Get ID selector for an element.
 * */
export function getElementIdSelectors(
  element: Element,
  _options?: CssSelectorGeneratorOptions,
): CssSelectorGenerated[] {
  const id = element.getAttribute("id") ?? "";
  const selector = `#${sanitizeSelectorItem(id)}` as CssSelectorGenerated;
  const rootNode = element.getRootNode({ composed: false });
  return !INVALID_ID_RE.test(id) && testSelector([element], selector, rootNode)
    ? [selector]
    : [];
}

/**
 * Get ID selector for an element.
 */
export function getIdSelector(
  elements: Element[],
  options?: CssSelectorGeneratorOptions,
): CssSelectorGenerated[] {
  return elements.length === 0 || elements.length > 1
    ? []
    : getElementIdSelectors(elements[0], options);
}
