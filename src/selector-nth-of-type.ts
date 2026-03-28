import { getTagSelector } from "./selector-tag.js";
import { CssSelectorGenerated, CssSelectorGeneratorOptions } from "./types.js";
import { getIntersection } from "./utilities-data.js";

/**
 * Get nth-of-type selector for an element.
 */
export function getElementNthOfTypeSelector(
  element: Element,
  _options?: CssSelectorGeneratorOptions,
): CssSelectorGenerated[] {
  const tag = getTagSelector([element])[0];
  const parent = element.parentNode;
  const parentElement = parent && "children" in parent ? parent : null;

  if (parentElement) {
    const siblings = Array.from(parentElement.children).filter(
      (element) => element.tagName.toLowerCase() === tag,
    );
    const elementIndex = siblings.indexOf(element);
    if (elementIndex > -1) {
      return [
        `${tag}:nth-of-type(${String(elementIndex + 1)})` as CssSelectorGenerated,
      ];
    }
  }

  return [];
}

/**
 * Get Nth-of-type selector matching all elements.
 */
export function getNthOfTypeSelector(
  elements: Element[],
  options?: CssSelectorGeneratorOptions,
): CssSelectorGenerated[] {
  return getIntersection(elements.map((el) => getElementNthOfTypeSelector(el, options)));
}
