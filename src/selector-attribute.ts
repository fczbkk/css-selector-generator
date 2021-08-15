import {
  sanitizeSelectorItem,
  sanitizeSelectorNeedle
} from './utilities-selectors';
import {convertMatchListToRegExp, getIntersection} from './utilities-data';
import {CssSelector, SelectorNeedle} from './types';

// List of attributes to be ignored. These are handled by different selector types.
export const ATTRIBUTE_BLACKLIST = convertMatchListToRegExp([
  'class',
  'id',
  // Angular attributes
  'ng-*'
])

/**
 * Get attribute selectors for an element.
 */
export function attributeNodeToSelector ({
  nodeName,
  nodeValue
}: Node) {
  return `[${nodeName}='${sanitizeSelectorItem(nodeValue)}']`
}

/**
 * Checks whether attribute should be used as a selector.
 */
export function isValidAttributeNode ({nodeName}: Node) {
  return !ATTRIBUTE_BLACKLIST.test(nodeName)
}

/**
 * Get attribute selectors for an element.
 */
export function getElementAttributeSelectors (element: Element): Array<CssSelector> {
  return Array.from(element.attributes)
    .filter(isValidAttributeNode)
    .map(attributeNodeToSelector)
}

/**
 * Get attribute selectors matching all elements.
 */
export function getAttributeSelectors (needle: SelectorNeedle): Array<CssSelector> {
  const elements = sanitizeSelectorNeedle(needle)
  const elementSelectors = elements.map(getElementAttributeSelectors)
  return getIntersection(elementSelectors)
}
