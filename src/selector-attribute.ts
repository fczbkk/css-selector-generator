import { sanitizeSelectorItem } from "./utilities-selectors.js";
import { createPatternMatcher, getIntersection } from "./utilities-data.js";
import { CssSelectorGenerated } from "./types.js";

type AttributeData = {
  name: string;
  value: string;
};

// List of attributes to be ignored. These are handled by different selector types.
export const attributeBlacklistMatch = createPatternMatcher([
  "class",
  "id",
  // Angular attributes
  "ng-*",
]);

/**
 * Get simplified attribute selector for an element.
 */
export function attributeNodeToSimplifiedSelector({
  name,
}: AttributeData): CssSelectorGenerated {
  return `[${name}]` as CssSelectorGenerated;
}

/**
 * Get attribute selector for an element.
 */
export function attributeNodeToSelector({
  name,
  value,
}: AttributeData): CssSelectorGenerated {
  return `[${name}='${value}']` as CssSelectorGenerated;
}

/**
 * Checks whether attribute should be used as a selector.
 */
export function isValidAttributeNode(
  { nodeName }: Node,
  element: Element,
): boolean {
  // form input value should not be used as a selector
  const tagName = element.tagName.toLowerCase();
  if (["input", "option"].includes(tagName) && nodeName === "value") {
    return false;
  }

  return !attributeBlacklistMatch(nodeName);
}

/**
 * Sanitize all attribute data. We want to do it once, before we start to generate simplified/full selectors from the same data.
 */
function sanitizeAttributeData({ nodeName, nodeValue }: Node): AttributeData {
  return {
    name: sanitizeSelectorItem(nodeName),
    value: sanitizeSelectorItem(nodeValue),
  };
}

/**
 * Get attribute selectors for an element.
 */
export function getElementAttributeSelectors(
  element: Element,
): CssSelectorGenerated[] {
  const validAttributes = Array.from(element.attributes)
    .filter((attributeNode) => isValidAttributeNode(attributeNode, element))
    .map(sanitizeAttributeData);
  return [
    ...validAttributes.map(attributeNodeToSimplifiedSelector),
    ...validAttributes.map(attributeNodeToSelector),
  ];
}

/**
 * Get attribute selectors matching all elements.
 */
export function getAttributeSelectors(
  elements: Element[],
): CssSelectorGenerated[] {
  const elementSelectors = elements.map(getElementAttributeSelectors);
  return getIntersection(elementSelectors);
}
