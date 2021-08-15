import {sanitizeSelectorItem} from './utilities-selectors'
import {convertMatchListToRegExp} from './utilities-data'
import {CssSelector} from './types'

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
function attributeNodeToSelector ({
  nodeName,
  nodeValue
}: Node) {
  return `[${nodeName}='${sanitizeSelectorItem(nodeValue)}']`
}

/**
 * Checks whether attribute should be used as a selector.
 */
function isValidAttributeNode ({nodeName}: Node) {
  return !ATTRIBUTE_BLACKLIST.test(nodeName)
}

/**
 * Get attribute selectors for an element.
 */
export function getAttributeSelectors (element: Element): Array<CssSelector> {
  return Array.from(element.attributes)
    .filter(isValidAttributeNode)
    .map(attributeNodeToSelector)
}
